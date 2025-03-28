import React, { useState } from 'react';
import { Mic, MicOff, Send, RotateCcw } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { InterviewQuestion, InterviewFeedback } from './types';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

interface InterviewSessionProps {
  question: InterviewQuestion;
  onAnswer: (answer: string) => Promise<void>;
  onNext: () => void;
  isLastQuestion: boolean;
  isProcessing: boolean;
}

export function InterviewSession({
  question,
  onAnswer,
  onNext,
  isLastQuestion,
  isProcessing
}: InterviewSessionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(chunks => [...chunks, e.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        // Convert audio to text using speech-to-text API
        // For now, we'll just use the text input
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    await onAnswer(answer);
    setAnswer('');
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {question.question}
          </h3>
          {question.context && (
            <p className="text-sm text-gray-500">{question.context}</p>
          )}
        </div>

        <div className="space-y-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Type your answer here..."
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAnswer('')}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || isProcessing}
            >
              {isProcessing ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isLastQuestion ? 'Finish Interview' : 'Next Question'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}