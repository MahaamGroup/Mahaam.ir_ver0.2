import React from 'react';
import { HeroSection } from '../home/HeroSection';
import { AudienceSection } from '../home/AudienceSection';
import { ProblemSolutionSection } from '../home/ProblemSolutionSection';
import { ApproachSection } from '../home/ApproachSection';
import { JourneySection } from '../home/JourneySection';
import { WhyMahaamSection } from '../home/WhyMahaamSection';
import { LeadMagnetSection } from '../home/LeadMagnetSection';
import { HomeFaqSection } from '../home/HomeFaqSection';
import { FinalCtaSection } from '../home/FinalCtaSection';
import { RevealSection } from '../ui/RevealSection';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0 overflow-hidden">
      <HeroSection onNavigate={onNavigate} />

      <RevealSection direction="up" distance={36} duration={0.7}>
        <AudienceSection onNavigate={onNavigate} />
      </RevealSection>

      <RevealSection direction="up" distance={36} duration={0.7}>
        <ProblemSolutionSection onNavigate={onNavigate} />
      </RevealSection>

      <RevealSection direction="up" distance={36} duration={0.7}>
        <ApproachSection onNavigate={onNavigate} />
      </RevealSection>

      <RevealSection direction="up" distance={36} duration={0.7}>
        <JourneySection onNavigate={onNavigate} />
      </RevealSection>

      <RevealSection direction="up" distance={36} duration={0.7}>
        <WhyMahaamSection onNavigate={onNavigate} />
      </RevealSection>

      <RevealSection direction="up" distance={36} duration={0.7}>
        <LeadMagnetSection />
      </RevealSection>

      <RevealSection direction="up" distance={36} duration={0.7}>
        <HomeFaqSection onNavigate={onNavigate} />
      </RevealSection>

      <RevealSection direction="up" distance={36} duration={0.7}>
        <FinalCtaSection onNavigate={onNavigate} />
      </RevealSection>
    </div>
  );
};
