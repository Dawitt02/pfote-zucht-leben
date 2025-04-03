
import React from 'react';
import { Search, MessageCircle, Users, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';

const Community = () => {
  // Mock community data
  const events = [
    {
      id: '1',
      title: 'Hundezuchtausstellung München',
      date: '15.05.2025',
      location: 'Messegelände München',
      participants: 145,
      imageUrl: 'https://images.unsplash.com/photo-1551730459-92db2a308d6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: '2',
      title: 'Workshop: Gesunde Zucht',
      date: '22.05.2025',
      location: 'Online-Seminar',
      participants: 78,
      imageUrl: 'https://images.unsplash.com/photo-1542466500-dccb2789cbbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  const discussions = [
    {
      id: '1',
      title: 'Ernährungstipps für trächtige Hündinnen',
      author: 'HundeProfi',
      replies: 24,
      lastActive: '2 Stunden'
    },
    {
      id: '2',
      title: 'Erfahrungen mit HD-Röntgen bei jungen Hunden?',
      author: 'SchäferhundFan',
      replies: 18,
      lastActive: '5 Stunden'
    },
    {
      id: '3',
      title: 'Wurfboxgestaltung für den Sommer',
      author: 'ZuchtHelferin',
      replies: 31,
      lastActive: '1 Tag'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-zucht-cream">
      <main className="flex-1 overflow-auto pb-16">
        <div className="app-container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Community</h1>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zucht-brown/50 h-4 w-4" />
            <Input 
              placeholder="Suche in der Community" 
              className="pl-9 bg-white"
            />
          </div>

          {/* Tabs for different community sections */}
          <Tabs defaultValue="events" className="mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="events" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" /> Events
              </TabsTrigger>
              <TabsTrigger value="discussions" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" /> Diskussionen
              </TabsTrigger>
            </TabsList>
            <TabsContent value="events" className="mt-4 space-y-4">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </TabsContent>
            <TabsContent value="discussions" className="mt-4 space-y-3">
              {discussions.map(discussion => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))}
            </TabsContent>
          </Tabs>

          {/* Popular breeders */}
          <h2 className="text-xl font-semibold mb-3">Aktive Züchter</h2>
          <div className="flex overflow-x-auto space-x-3 pb-2 -mx-4 px-4">
            <BreederCard name="Sarah M." breeds="Golden Retriever" />
            <BreederCard name="Michael L." breeds="Deutscher Schäferhund" />
            <BreederCard name="Anna K." breeds="Labrador, Collie" />
          </div>
        </div>
      </main>
      <Navbar />
    </div>
  );
};

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    participants: number;
    imageUrl: string;
  };
}

function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden card-shadow">
      <div className="relative h-40">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white font-semibold">{event.title}</h3>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between text-sm mb-2">
          <div className="flex items-center text-zucht-brown/80">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-zucht-brown/80">
            <Users className="h-4 w-4 mr-1" />
            <span>{event.participants} Teilnehmer</span>
          </div>
        </div>
        <div className="flex items-center text-zucht-brown/80 text-sm">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface DiscussionCardProps {
  discussion: {
    id: string;
    title: string;
    author: string;
    replies: number;
    lastActive: string;
  };
}

function DiscussionCard({ discussion }: DiscussionCardProps) {
  return (
    <Card className="card-shadow">
      <CardContent className="p-3">
        <h3 className="font-medium mb-1">{discussion.title}</h3>
        <div className="flex justify-between text-sm">
          <span className="text-zucht-blue">{discussion.author}</span>
          <div className="flex items-center text-zucht-brown/70">
            <MessageCircle className="h-3 w-3 mr-1" />
            <span>{discussion.replies}</span>
          </div>
        </div>
        <div className="text-xs text-zucht-brown/70 mt-1">
          Aktiv vor {discussion.lastActive}
        </div>
      </CardContent>
    </Card>
  );
}

interface BreederCardProps {
  name: string;
  breeds: string;
}

function BreederCard({ name, breeds }: BreederCardProps) {
  // Generate a consistent avatar color based on name
  const colorIndex = name.charCodeAt(0) % 3;
  const bgColors = ['bg-zucht-amber', 'bg-zucht-blue', 'bg-zucht-green'];
  
  return (
    <Card className="min-w-[140px] card-shadow">
      <CardContent className="p-3 flex flex-col items-center">
        <div className={`${bgColors[colorIndex]} text-white w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
          {name.charAt(0)}
        </div>
        <h3 className="font-medium text-sm">{name}</h3>
        <p className="text-xs text-zucht-brown/70 text-center">{breeds}</p>
      </CardContent>
    </Card>
  );
}

export default Community;
