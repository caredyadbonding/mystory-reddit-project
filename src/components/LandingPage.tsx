import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SurveyForm } from "./SurveyForm"
import caregiverBurdenImage from "@/assets/caregiver-burden.png"
import caregivingSupportImage from "@/assets/caregiving-support.png"

export const LandingPage = () => {
  const [showSurvey, setShowSurvey] = useState(false)

  const handleSurveyClick = () => {
    // Track survey click analytics
    if (window.gtag) {
      window.gtag('event', 'survey_click', {
        event_category: 'engagement',
        event_label: 'share_story_button',
        value: 1
      })
    }

    if (window.rdt) {
      window.rdt.track('survey_click')
    }

    setShowSurvey(true)
  }

  if (showSurvey) {
    return <SurveyForm onBack={() => setShowSurvey(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight tracking-tight whitespace-nowrap">
            Drop your story. Build the glory.
          </h1>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 pointer-events-none" />
      </section>

      {/* Video Section */}
      <section className="relative py-12 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <video
            className="w-full rounded-2xl aspect-video shadow-3d border-2 border-white/20"
            controls
            preload="metadata"
          >
            <source src="/Love_s_Enduring_Journey_Through_Time.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* My Story Header */}
      <section className="py-8 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            My Story
          </h2>
          <p className="text-xl text-foreground leading-relaxed">
            I have a story I want to share with you.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 md:p-12 shadow-3d-deep border-4 border-white/60 bg-card/90 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-500 hover:shadow-3d-lift">
            <div className="prose prose-lg mx-auto text-foreground leading-relaxed space-y-6">
              <p className="text-lg">
                <strong>Once upon a time…</strong> it all began with a BIG dream. The American Dream. I came to the U.S. from India, chasing a Ph.D. and a beautiful life. But on October 4th, 2022, a cancer diagnosis changed everything.
              </p>

              <p>
                My husband became my caregiver, my unwavering support system, while we were far from home with no family or friends nearby. The burden of my constant medical needs—the surgeries, the treatments, the daily leakages from my ostomy bag—took over our lives. He had to manage our children, our home, his job, and all my doctor's appointments back to back. I was so consumed by being a survivor, that I lost focus on our emotional bond. In my struggle to survive, I stopped seeing him as my husband and only saw him as my caregiver. I didn't realize that while he was taking care of my body and all these tasks, the person he was was slowly disappearing.
              </p>

              <p>
                Then one night, I found him in the dark. I was shocked to find him sitting alone, overwhelmed and broken from the stress. He told me, he was going to lose his job. For a few days, it felt like there was a huge earthquake, everything is over. In my pain, I even told him, "I don't want to live." He looked at me and said, "Just hang in there. Don't give up."
              </p>

              <p>
                My husband's struggle gave me a profound realization: while everyone was focused on the survivor, no one was asking who was taking care of the caregiver. I was so caught up in my role as the patient, that I had forgotten to see the human being in front of me. Even through his own misery, he was still worried about me. I asked him honestly if he ever wished he didn't have to take care of me. He said yes, those thoughts had come to him many times, but he could never leave.
              </p>

              <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-primary mb-4">
                  This is my story. What's yours?
                </h2>
              </div>

              <p>
                My mission is to build a community. A place where our stories are heard, and our experiences are shared. I am not building a product; I am listening to understand the true needs of caregivers so we can build a space where we all feel seen again.
              </p>

              <div className="text-center py-8">
                <p className="text-xl font-semibold text-deep-sage mb-6">
                  Share your story with me. Your voice will be our direction.
                </p>
                <Button
                  onClick={handleSurveyClick}
                  size="lg"
                  className="bg-gradient-bonding hover:shadow-3d-deep transition-all duration-300 text-lg px-8 py-6 rounded-xl transform hover:scale-110 shadow-3d-lift border-2 border-white/40 hover:border-white/60"
                >
                  Share Your Story
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-6" style={{ backgroundColor: 'hsl(var(--gentle-cream) / 0.3)' }}>
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">
            Want to Talk?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            If you're open, I'd love to hear your story directly. Sometimes a conversation can say what words alone cannot.
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl px-8 py-6 transform hover:scale-110 shadow-3d-lift hover:shadow-3d-deep bg-white/60 backdrop-blur-sm"
          >
            <a
              href="https://calendly.com/sia-sanjeevaniai/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Track calendar click analytics
                if (window.gtag) {
                  window.gtag('event', 'calendar_click', {
                    event_category: 'engagement',
                    event_label: 'schedule_conversation',
                    value: 1
                  })
                }

                if (window.rdt) {
                  window.rdt.track('calendar_click')
                }
              }}
            >
              Schedule a Conversation
            </a>
          </Button>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 shadow-3d-deep bg-card/95 backdrop-blur-sm border-4 border-white/60 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-3d-lift">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary mb-4">Your Privacy Matters</h3>
              <div className="bg-gradient-bonding text-white p-6 rounded-xl shadow-3d">
                <p className="text-lg font-semibold mb-2">We Will Never Sell Your Data</p>
                <p className="text-sm opacity-90">Your story is sacred. We pledge to never sell, share, or monetize your personal information with any third party. Your trust is our foundation.</p>
              </div>
            </div>

            <div className="prose prose-sm mx-auto text-muted-foreground">
              <h4 className="text-lg font-semibold text-foreground mb-3">Privacy Policy</h4>
              <p className="mb-3">
                <strong>Data Collection:</strong> We collect only the information you voluntarily provide through our survey to understand caregiver experiences and build supportive community resources.
              </p>
              <p className="mb-3">
                <strong>Data Use:</strong> Your responses help us identify patterns, needs, and opportunities to better support caregivers. All data is analyzed in aggregate and individual responses remain confidential.
              </p>
              <p className="mb-3">
                <strong>Data Protection:</strong> We use industry-standard security measures to protect your information. Access is limited to authorized personnel only.
              </p>
              <p className="mb-3">
                <strong>Your Rights:</strong> You may request access to, correction of, or deletion of your personal data at any time by contacting us directly.
              </p>
              <p className="mb-3">
                <strong>Contact:</strong> For privacy questions or concerns, please reach out to us through our scheduled conversations or email.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}