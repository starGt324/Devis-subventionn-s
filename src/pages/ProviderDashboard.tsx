import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, TrendingUp, CreditCard, FileText, Inbox, LogOut } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";
import AvailableRequests from "@/components/provider/AvailableRequests";
import MyQuotes from "@/components/provider/MyQuotes";
import PerformanceStats from "@/components/provider/PerformanceStats";
import SubscriptionManagement from "@/components/provider/SubscriptionManagement";
import NotificationsPanel from "@/components/provider/NotificationsPanel";
import axios from "axios";

const ProviderDashboard = () => {
  const { signOut , user} = useClerk();
  const [activeTab, setActiveTab] = useState("requests");
  const [notificationCount, setNotificationCount] = useState(3);

const [category_id, setCategory_id] = useState<string | null>(null);

useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/provider-profiles/${user.id}`)
    .then(res => setCategory_id(res.data.data.category_id))
    .catch(console.error);
}, [user?.id]);

  return (
<div className="min-h-screen bg-background">
  {/* Header */}
  <header className="border-b bg-card">
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tableau de Bord Prestataire</h1>
          <p className="text-sm text-muted-foreground">Gérez vos devis et vos performances</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setActiveTab("notifications")}>
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {notificationCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notificationCount}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  </header>

  {/* Main content */}
  <main className="container mx-auto px-4 py-8">
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {/* Tabs List */}
      <TabsList className="flex overflow-x-auto no-scrollbar gap-2 mb-6 sm:mb-8">
        <TabsTrigger value="requests" className="whitespace-nowrap flex-shrink-0">
          <Inbox className="h-4 w-4 mr-2" />
          Demandes
        </TabsTrigger>
        <TabsTrigger value="quotes" className="whitespace-nowrap flex-shrink-0">
          <FileText className="h-4 w-4 mr-2" />
          Mes Devis
        </TabsTrigger>
        <TabsTrigger value="performance" className="whitespace-nowrap flex-shrink-0">
          <TrendingUp className="h-4 w-4 mr-2" />
          Performance
        </TabsTrigger>
        <TabsTrigger value="subscription" className="whitespace-nowrap flex-shrink-0">
          <CreditCard className="h-4 w-4 mr-2" />
          Abonnement
        </TabsTrigger>
        <TabsTrigger value="notifications" className="whitespace-nowrap flex-shrink-0">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
          {notificationCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center">
              {notificationCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Tabs Content */}
      <TabsContent value="requests">
        <AvailableRequests category_id={category_id} />
      </TabsContent>

      <TabsContent value="quotes">
        <MyQuotes />
      </TabsContent>

      <TabsContent value="performance">
        <PerformanceStats />
      </TabsContent>

      <TabsContent value="subscription">
        <SubscriptionManagement />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationsPanel
          onNotificationRead={() => setNotificationCount(Math.max(0, notificationCount - 1))}
        />
      </TabsContent>
    </Tabs>
  </main>
</div>


  );
};

export default ProviderDashboard;
