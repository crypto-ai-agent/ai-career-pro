@@ .. @@
-      <Card>
+      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
+        {stats.map((stat) => {
+          const Icon = stat.icon;
+          return (
+            <Card key={stat.name} className="bg-white">
+              <div className="p-6">
+                <div className="flex items-center">
+                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
+                    <Icon className="w-6 h-6" />
+                  </div>
+                  <div className="ml-4">
+                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
+                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
+                    {stat.change && (
+                      <div className={cn(
+                        "text-sm flex items-center",
+                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
+                      )}>
+                        {stat.changeType === 'positive' ? '↑' : '↓'} {stat.change}
+                      </div>
+                    )}
+                  </div>
+                </div>
+              </div>
+            </Card>
+          );
+        })}
+      </div>
+      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
+        <Card className="bg-white">
          <div className="p-6">
-            <div className="flex items-center">
-              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
-                <Users className="w-6 h-6 text-indigo-600" />
-              </div>
-              <div className="ml-4">
-                <p className="text-sm font-medium text-gray-500">Active Subscribers</p>
-                <p className="text-2xl font-semibold text-gray-900">
-                  {stats?.subscribedCount || 0}
-                </p>
-              </div>
+            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
+            <div className="space-y-4">
+              {/* Add recent activity items here */}
+              <div className="border-l-2 border-indigo-500 pl-4">
+                <p className="text-sm text-gray-600">New subscription</p>
+                <p className="text-sm font-medium text-gray-900">Pro Plan - $29.99/mo</p>
+                <p className="text-xs text-gray-500">2 minutes ago</p>
+              </div>
+              <div className="border-l-2 border-green-500 pl-4">
+                <p className="text-sm text-gray-600">Payment successful</p>
+                <p className="text-sm font-medium text-gray-900">Invoice #1234</p>
+                <p className="text-xs text-gray-500">15 minutes ago</p>
+              </div>
             </div>
           </div>
-        </Card>
+        </Card>
+        <Card className="bg-white">
+          <div className="p-6">
+            <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
+            <div className="space-y-4">
+              <div className="flex items-center justify-between">
+                <span className="text-sm text-gray-600">API Response Time</span>
+                <span className="text-sm font-medium text-green-600">245ms</span>
+              </div>
+              <div className="flex items-center justify-between">
+                <span className="text-sm text-gray-600">Error Rate</span>
+                <span className="text-sm font-medium text-green-600">0.02%</span>
+              </div>
+              <div className="flex items-center justify-between">
+                <span className="text-sm text-gray-600">Uptime</span>
+                <span className="text-sm font-medium text-green-600">99.99%</span>
+              </div>
+            </div>
+          </div>
+        </Card>
+      </div>
     </div>
   );
 }