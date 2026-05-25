import { Module } from '@nestjs/common';
import { OnboardingWizard } from './onboarding.wizard';

@Module({
  providers: [OnboardingWizard],
  exports: [OnboardingWizard],
})
export class OnboardingModule {}
