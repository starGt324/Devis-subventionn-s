import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Notification {
  id: string;
  type: "reminder" | "update" | "alert" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "reminder",
    title: "Devis bientôt expiré",
    message: "Votre devis pour la demande #REQ045 expirera dans 2 jours",
    time: "il y a 2 heures",
    read: false
  },
  {
    id: "2",
    type: "update",
    title: "Devis accepté !",
    message: "Le client Marie D. a accepté votre devis de 450 €",
    time: "il y a 5 heures",
    read: false
  },
  {
    id: "3",
    type: "alert",
    title: "Renouvellement d'abonnement",
    message: "Votre abonnement sera renouvelé le 1er février 2024",
    time: "il y a 1 jour",
    read: false
  },
  {
    id: "4",
    type: "info",
    title: "Nouvelle demande disponible",
    message: "Une nouvelle demande de plomberie à Paris 15 correspond à votre profil",
    time: "il y a 2 jours",
    read: true
  }
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "reminder":
      return <Bell className="h-5 w-5 text-blue-500" />;
    case "update":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "alert":
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    case "info":
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
};

interface NotificationsPanelProps {
  onNotificationRead: () => void;
}

const NotificationsPanel = ({ onNotificationRead }: NotificationsPanelProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notifications & Rappels</CardTitle>
              <CardDescription>Restez informé de l'activité de vos devis</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Tout marquer comme lu
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  !notification.read ? "bg-muted/50" : "bg-background"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold">{notification.title}</h4>
                      {!notification.read && (
                        <Badge variant="secondary" className="ml-2">Nouveau</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onNotificationRead}
                        >
                          Marquer comme lu
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPanel;
