import React, { useState, useEffect } from 'react';
import { UserRound } from 'lucide-react';
import { SEOHead } from '../../../components/shared/SEOHead';
import { useSEO } from '../../../hooks/useSEO';
import { useForm } from '../../../hooks/useForm';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/layout/PageHeader';
import { RecentItems } from '../../../components/shared/RecentItems';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import { InterviewForm } from './InterviewForm';
import { InterviewSession } from './InterviewSession';
import { FeedbackDisplay } from './FeedbackDisplay';
import { InterviewFormData, initialFormData, InterviewQuestion, InterviewFeedback, InterviewSession as IInterviewSession } from './types';
import { useAuth } from '../../../contexts/AuthContext';
import { getInterviews, createInterview } from '../../../services/database';

export function InterviewCoach() {
  const { user } = useAuth();
  const {
    formData,
    isLoading,
    error,
    handleChange: handleInputChange,
    handleSubmit
  } = useForm({
    initialData: initialFormData,
    onSubmit: startInterview
  });

  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentSessions, setRecentSessions] = useState<IInterviewSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    async function loadRecentSessions() {
      if (!user) return;
      try {
        const sessions = await getInterviews(user.id);
        setRecentSessions(sessions.slice(0, 4));
      } catch (error) {
        console.error('Error loading recent sessions:', error);
      } finally {
        setLoadingSessions(false);
      }
    }

    loadRecentSessions();
  }, [user]);

  async function startInterview(data: InterviewFormData) {
    try {
      // In a real application, fetch questions from the API based on form data
      const mockQuestions: InterviewQuestion[] = [
        {
          id: '1',
          question: 'Tell me about a challenging project you worked on.',
          type: data.interviewType,
          difficulty: 'medium'
        },
        {
          id: '2',
          question: 'How do you handle conflicts in a team?',
          type: data.interviewType,
          difficulty: 'medium'
        },
        {
          id: '3',
          question: 'Where do you see yourself in 5 years?',
          type: data.interviewType,
          difficulty: 'easy'
        }
      ];

      setQuestions(mockQuestions);
      setCurrentQuestion(mockQuestions[0]);
      setQuestionIndex(0);
      setFeedback(null);
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  }

  const handleAnswer = async (answer: string) => {
    if (!user || !currentQuestion) return;

    setIsProcessing(true);
    try {
      // In a real application, send the answer to the API for analysis
      // For now, we'll use mock feedback
      if (questionIndex === questions.length - 1) {
        const mockFeedback: InterviewFeedback = {
          score: 85,
          strengths: [
            'Clear communication style',
            'Good examples provided',
            'Structured responses'
          ],
          improvements: [
            'Could provide more specific metrics',
            'Some answers could be more concise'
          ],
          communicationClarity: 90,
          structureAndOrganization: 85,
          nextSteps: [
            'Practice quantifying your achievements',
            'Prepare more STAR method examples',
            'Review common technical questions'
          ]
        };

        setFeedback(mockFeedback);

        // Save the session
        await createInterview({
          user_id: user.id,
          title: `${formData.interviewType} Interview - ${formData.role}`,
          interview_type: formData.interviewType,
          role: formData.role,
          score: mockFeedback.score,
          feedback: mockFeedback
        });

        // Update recent sessions
        const newSession: IInterviewSession = {
          id: Date.now().toString(),
          type: formData.interviewType,
          role: formData.role,
          date: new Date().toISOString(),
          score: mockFeedback.score,
          questions,
          feedback: mockFeedback
        };

        setRecentSessions(prev => [newSession, ...prev.slice(0, 3)]);
      } else {
        setCurrentQuestion(questions[questionIndex + 1]);
        setQuestionIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error processing answer:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Interview Coach Tool - AI Career Pro"}
        description={metadata?.description || "Practice interviews and get instant AI feedback to improve your performance"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/tools/interview"
      />
      <PageHeader 
        title="AI Interview Coach"
        description="Practice interviews and get instant feedback"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <Card>
              {error && <ErrorAlert message={error} />}
              {!currentQuestion && (
                <InterviewForm
                  formData={formData}
                  isLoading={isLoading}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                />
              )}
            </Card>
          </div>

          <div className="lg:w-2/3">
            {currentQuestion && !feedback && (
              <InterviewSession
                question={currentQuestion}
                onAnswer={handleAnswer}
                onNext={() => {}}
                isLastQuestion={questionIndex === questions.length - 1}
                isProcessing={isProcessing}
              />
            )}

            {feedback && (
              <FeedbackDisplay feedback={feedback} />
            )}
          </div>
        </div>

        <RecentItems
          title="Recent Interview Sessions"
          items={recentSessions}
          renderItem={(session) => (
            <Card key={session.id}>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">
                  {session.type} Interview
                </h3>
                <p className="text-sm text-gray-500">{session.role}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Score: {session.score}%
                  </span>
                </div>
              </div>
            </Card>
          )}
        />
      </div>
    </div>
  );
}