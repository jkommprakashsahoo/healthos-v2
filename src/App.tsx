import React, { useState } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { BottomNavigation, TabType } from './components/BottomNavigation';
import { HomeScreen } from './components/HomeScreen';
import { TimelineScreen } from './components/TimelineScreen';
import { AskAIScreen } from './components/AskAIScreen';
import { RecordsScreen } from './components/RecordsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { DoctorPrepScreen } from './components/DoctorPrepScreen';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { TimelineEventSheet } from './components/TimelineEventSheet';
import { ShareSheetModal } from './components/ShareSheetModal';
import { UploadFlowModal } from './components/UploadFlowModal';

import { TimelineEvent, HealthDocument } from './types';
import { PatientProfile } from './types';

interface AppProps {
  patient: PatientProfile;
}

const emptyDoctorBriefing = {
  whyImHere: 'Upload records to prepare a doctor briefing.',
  recentChanges: [],
  currentMedications: [],
  relevantHistory: [],
  recentReports: [],
  questionsToAsk: [],
  conciseSummary60s: 'No health records have been uploaded yet.',
};

export function App({ patient }: AppProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [documents, setDocuments] = useState<HealthDocument[]>([]);
  const [doctorBriefing] = useState(emptyDoctorBriefing);

  // Modals & Sub-screen state
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<HealthDocument | null>(null);
  const [isDoctorPrepOpen, setIsDoctorPrepOpen] = useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isUploadFlowOpen, setIsUploadFlowOpen] = useState(false);

  // AI Prompt routing state
  const [aiQuestionPrompt, setAiQuestionPrompt] = useState<string | undefined>(undefined);
  const [aiActionType, setAiActionType] = useState<
    'what_changed' | 'previous_episodes' | 'doctor_prep' | 'summary' | 'custom' | undefined
  >(undefined);

  const handleNavigateTab = (tab: TabType) => {
    setIsDoctorPrepOpen(false);
    setActiveTab(tab);
  };

  const handleSelectAiQuestion = (
    question: string,
    actionType: 'what_changed' | 'previous_episodes' | 'doctor_prep' | 'summary' | 'custom' = 'custom'
  ) => {
    if (actionType === 'doctor_prep') {
      setIsDoctorPrepOpen(true);
      return;
    }
    setAiQuestionPrompt(question);
    setAiActionType(actionType);
    setActiveTab('ask_ai');
    setIsDoctorPrepOpen(false);
  };

  const handleViewSource = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setSelectedDocument(doc);
    }
  };

  const handleAddConfirmedEvents = (
    newEvents: TimelineEvent[],
    newDocument: HealthDocument
  ) => {
    setTimelineEvents((prev) => [...newEvents, ...prev]);
    setDocuments((prev) => [newDocument, ...prev]);
  };

  const handleResetData = () => {
    setTimelineEvents([]);
    setDocuments([]);
  };

  return (
    <MobileFrame
      bottomNav={
        <BottomNavigation
          activeTab={activeTab}
          onChangeTab={handleNavigateTab}
          recordsCount={documents.length}
        />
      }
    >
      {/* If Doctor Prep screen is open, display it as top-level screen */}
      {isDoctorPrepOpen ? (
        <DoctorPrepScreen
          briefing={doctorBriefing}
          onBack={() => setIsDoctorPrepOpen(false)}
          onOpenShareSheet={() => setIsShareSheetOpen(true)}
          onViewSource={handleViewSource}
        />
      ) : (
        <>
          {activeTab === 'home' && (
            <HomeScreen
              timelineEvents={timelineEvents}
              onOpenDoctorPrep={() => setIsDoctorPrepOpen(true)}
              onNavigateTab={handleNavigateTab}
              onSelectAiQuestion={handleSelectAiQuestion}
              onSelectEvent={(event) => setSelectedEvent(event)}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineScreen
              timelineEvents={timelineEvents}
              onSelectEvent={(event) => setSelectedEvent(event)}
              onOpenAddRecord={() => setIsUploadFlowOpen(true)}
            />
          )}

          {activeTab === 'ask_ai' && (
            <AskAIScreen
              timelineEvents={timelineEvents}
              documents={documents}
              medications={[]}
              labResults={[]}
              onOpenDoctorPrep={() => setIsDoctorPrepOpen(true)}
              onViewSource={handleViewSource}
              initialQuestion={aiQuestionPrompt}
              initialActionType={aiActionType}
            />
          )}

          {activeTab === 'records' && (
            <RecordsScreen
              documents={documents}
              onSelectDocument={(doc) => setSelectedDocument(doc)}
              onOpenAddRecord={() => setIsUploadFlowOpen(true)}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              patient={patient}
              timelineEvents={timelineEvents}
              documents={documents}
              onResetData={handleResetData}
            />
          )}
        </>
      )}

      {/* Modals and Sheets */}
      <DocumentViewerModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />

      <TimelineEventSheet
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onViewSource={handleViewSource}
      />

      <ShareSheetModal
        isOpen={isShareSheetOpen}
        briefing={doctorBriefing}
        onClose={() => setIsShareSheetOpen(false)}
      />

      <UploadFlowModal
        isOpen={isUploadFlowOpen}
        onClose={() => setIsUploadFlowOpen(false)}
        onConfirmEvents={handleAddConfirmedEvents}
      />
    </MobileFrame>
  );
}
export default App;
