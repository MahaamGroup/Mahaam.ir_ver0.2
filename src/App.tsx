import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollProgressBar } from './components/ui/ScrollProgressBar';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { SocialFloatBox } from './components/ui/SocialFloatBox';
import { ShareFloatingBar } from './components/ui/ShareFloatingBar';
import { AiChatModal } from './components/chat/AiChatModal';
import { useDocumentMeta } from './lib/useDocumentMeta';
import { siteConfig } from './content/siteConfig';
import { HomePage } from './components/pages/HomePage';
import { AudiencesPage } from './components/pages/AudiencesPage';
import { AudienceDetailPage } from './components/pages/AudienceDetailPage';
import { JourneysPage } from './components/pages/JourneysPage';
import { JourneyDetailPage } from './components/pages/JourneyDetailPage';
import { DecisionEnginePage } from './components/pages/DecisionEnginePage';
import { AboutPage } from './components/pages/AboutPage';
import { ExperiencesPage } from './components/pages/ExperiencesPage';
import { InsightsPage } from './components/pages/InsightsPage';
import { ContactPage } from './components/pages/ContactPage';
import { FaqPage } from './components/pages/FaqPage';
import { LegalPage } from './components/pages/LegalPage';
import { AdminAssessmentsPage } from './components/pages/AdminAssessmentsPage';

import { audiencesData } from './content/audiences';
import { journeysData } from './content/journeys';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route Router Logic
  const renderCurrentPage = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigateTo} />;
    }

    // 2. Audiences
    if (currentPath === '/audiences') {
      return <AudiencesPage onNavigate={navigateTo} />;
    }
    if (currentPath.startsWith('/audiences/')) {
      const slug = currentPath.replace('/audiences/', '');
      const audience = audiencesData.find(a => a.slug === slug);
      if (audience) {
        return <AudienceDetailPage audience={audience} onNavigate={navigateTo} />;
      }
      return <AudiencesPage onNavigate={navigateTo} />;
    }

    // 3. Journeys
    if (currentPath === '/journeys') {
      return <JourneysPage onNavigate={navigateTo} />;
    }
    if (currentPath.startsWith('/journeys/')) {
      const slug = currentPath.replace('/journeys/', '');
      const journey = journeysData.find(j => j.slug === slug);
      if (journey) {
        return <JourneyDetailPage journey={journey} onNavigate={navigateTo} />;
      }
      return <JourneysPage onNavigate={navigateTo} />;
    }

    // 4. Decision Engine / Assessment
    if (currentPath === '/decision-engine' || currentPath === '/assessment') {
      return <DecisionEnginePage onNavigate={navigateTo} />;
    }

    // 5. About
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigateTo} />;
    }

    // 6. Experiences
    if (currentPath === '/experiences') {
      return <ExperiencesPage onNavigate={navigateTo} />;
    }

    // 7. Insights
    if (currentPath === '/insights') {
      return <InsightsPage onNavigate={navigateTo} />;
    }
    if (currentPath.startsWith('/insights/')) {
      const slug = currentPath.replace('/insights/', '');
      return <InsightsPage onNavigate={navigateTo} selectedArticleSlug={slug} />;
    }

    // 8. Contact
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigateTo} />;
    }

    // 9. FAQ
    if (currentPath === '/faq') {
      return <FaqPage onNavigate={navigateTo} />;
    }

    // 10. Legal
    if (currentPath === '/privacy') {
      return <LegalPage type="privacy" onNavigate={navigateTo} />;
    }
    if (currentPath === '/terms') {
      return <LegalPage type="terms" onNavigate={navigateTo} />;
    }

    // 11. Admin Panel for Assessments
    if (currentPath === '/admin' || currentPath === '/admin/assessments') {
      return <AdminAssessmentsPage onNavigate={navigateTo} />;
    }

    // Default Fallback: Home
    return <HomePage onNavigate={navigateTo} />;
  };

  // Base page metadata fallback
  useDocumentMeta({
    title: siteConfig.name,
    description: siteConfig.description,
    canonicalPath: currentPath
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F1] text-[#253244] font-sans selection:bg-[#3658B6]/20 selection:text-[#0C2340]">
      {/* Scroll Progress Bar at the top of the viewport */}
      <ScrollProgressBar />

      {/* Light Header */}
      <Header currentPath={currentPath} onNavigate={navigateTo} />
      
      <main className="flex-grow pt-20 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Unified Side Floating Dock on Left (SocialFloatBox on top, ShareFloatingBar below it) */}
      <div className="fixed top-1/2 -translate-y-1/2 left-3 sm:left-4 z-40 flex flex-col items-center gap-2.5 print:hidden">
        <SocialFloatBox />
        <ShareFloatingBar currentPath={currentPath} />
      </div>

      {/* AI Chatbot at bottom-6 right-6 with zero overlap */}
      <AiChatModal />

      {/* Go to Top Button at bottom-6 left-6 */}
      <ScrollToTop />
    </div>
  );
}
