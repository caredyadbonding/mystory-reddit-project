import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SurveyResponse {
  name: string
  email: string
  age?: number
  relationship: string
  relationship_other?: string
  duration: string
  typical_day: string
  difficulty_rating: number
  difficulty_reason: string
  emotional_challenge: string
  isolation_feeling: string
  relationship_learning: string
  connection_moment: string
  love_memory: string
  coping_methods: string
  talk_to_whom: string
  support_systems: string[]
  support_systems_other?: string
  missing_support: string
  extra_hour: string
  lost_activity: string
  additional_sharing?: string
}

interface SurveyFormProps {
  onBack?: () => void
}

export const SurveyForm = ({ onBack }: SurveyFormProps) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  
  const [formData, setFormData] = useState<Partial<SurveyResponse>>({
    name: "",
    email: "",
    age: undefined,
    relationship: "",
    relationship_other: "",
    duration: "",
    typical_day: "",
    difficulty_rating: 5,
    difficulty_reason: "",
    emotional_challenge: "",
    isolation_feeling: "",
    relationship_learning: "",
    connection_moment: "",
    love_memory: "",
    coping_methods: "",
    talk_to_whom: "",
    support_systems: [],
    support_systems_other: "",
    missing_support: "",
    extra_hour: "",
    lost_activity: "",
    additional_sharing: ""
  })

  const updateFormData = (field: keyof SurveyResponse, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSupportSystemChange = (system: string, checked: boolean) => {
    const current = formData.support_systems || []
    if (checked) {
      updateFormData('support_systems', [...current, system])
    } else {
      updateFormData('support_systems', current.filter(s => s !== system))
      // Clear the "other" text if "Other" is unchecked
      if (system === 'Other') {
        updateFormData('support_systems_other', '')
      }
    }
  }

  const submitSurvey = async () => {
    setIsSubmitting(true)
    try {
      // Transform data to match database schema
      const surveyData = {
        name: formData.name || "",
        email: formData.email || "",
        age_range: formData.duration || "",
        gender: "not-specified",
        relationship_status: formData.relationship || "",
        relationship_other: formData.relationship_other || null,
        support_systems: (formData.support_systems || []).join(", "),
        support_other: formData.support_systems_other || null,
        stress_level: formData.difficulty_rating || 5,
        additional_comments: [
          `Age: ${formData.age || 'Not provided'}`,
          `Typical Day: ${formData.typical_day || ''}`,
          `Difficulty Reason: ${formData.difficulty_reason || ''}`,
          `Emotional Challenge: ${formData.emotional_challenge || ''}`,
          `Isolation Feeling: ${formData.isolation_feeling || ''}`,
          `Relationship Learning: ${formData.relationship_learning || ''}`,
          `Connection Moment: ${formData.connection_moment || ''}`,
          `Love Memory: ${formData.love_memory || ''}`,
          `Coping Methods: ${formData.coping_methods || ''}`,
          `Talk To Whom: ${formData.talk_to_whom || ''}`,
          `Missing Support: ${formData.missing_support || ''}`,
          `Extra Hour: ${formData.extra_hour || ''}`,
          `Lost Activity: ${formData.lost_activity || ''}`,
          formData.additional_sharing ? `Additional Sharing: ${formData.additional_sharing}` : ''
        ].filter(Boolean).join('\n\n')
      }

      const { error } = await supabase
        .from('survey_responses')
        .insert([surveyData])

      if (error) throw error

      // Track completion analytics
      if (window.gtag) {
        window.gtag('event', 'survey_completed', {
          event_category: 'engagement',
          event_label: 'survey_submission',
          value: 1
        })
      }
      
      if (window.rdt) {
        window.rdt.track('survey_completed', {
          name: formData.name,
          email: formData.email,
          age: formData.age,
          relationship: formData.relationship
        })
      }

      // Trigger confetti and hearts
      const count = 200
      const defaults = {
        origin: { y: 0.7 }
      }

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
          shapes: ['heart'],
          colors: ['#ff69b4', '#ff1493', '#ff6347', '#ffc0cb', '#dda0dd']
        })
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55
      })

      fire(0.2, {
        spread: 60
      })

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      })

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      })

      fire(0.1, {
        spread: 120,
        startVelocity: 45
      })

      setShowThankYou(true)
      toast({
        title: "Thank you for sharing your story!",
        description: "Your voice matters and will help us build a supportive community.",
      })
    } catch (error) {
      console.error('Error submitting survey:', error)
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate("/")
    }
  }

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-2xl p-12 text-center shadow-lg bg-card/90 backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-primary mb-6">
            Thank You For Sharing Your Heart
          </h1>
          <div className="prose prose-lg mx-auto text-foreground leading-relaxed space-y-4">
            <p>
              In opening your heart, you've shown us the profound love that exists between caregivers and survivors— a bond that transcends the daily challenges and finds strength in shared vulnerability. Your story illuminates the beautiful, complex dance of care that weaves two lives together, even in the most difficult moments.
            </p>
            <p>
              Every word you've shared helps us understand not just the burden of caregiving, but the deep emotional connection that makes it sacred. You've reminded us that behind every act of care is a relationship built on love, hope, and unwavering commitment to one another.
            </p>
            <p>
              Together, we honor the bond between you and your loved one. Thank you for trusting us with your story.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <p className="text-lg font-semibold text-primary">
              If you're open, I'd love to hear your story directly
            </p>
            <Button 
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-4 transform hover:scale-105"
            >
              <a 
                href="https://calendly.com/sia-sanjeevaniai/30min" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Schedule a Conversation
              </a>
            </Button>
            <div className="pt-4">
              <Button variant="outline" onClick={handleBack}>
                Return to Story
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="container mx-auto max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 text-muted-foreground hover:text-foreground shadow-3d hover:shadow-3d-hover transition-all duration-300 transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Story
        </Button>

        <Card className="p-8 shadow-card-3d bg-card/95 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2 drop-shadow-lg">Share Your Story</h1>
            <p className="text-muted-foreground text-lg">Your voice matters. Help us build a community where caregivers are seen and supported.</p>
          </div>

          {currentSection === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-primary border-b-2 border-primary/30 pb-3 mb-4 drop-shadow-md">
                Contact Information
              </h2>
              <p className="text-muted-foreground">We'd love to stay connected with you</p>
              
              <div className="space-y-6">
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <Label htmlFor="name" className="text-lg font-medium text-foreground mb-2 block">Your Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <Label htmlFor="email" className="text-lg font-medium text-foreground mb-2 block">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <Label htmlFor="age" className="text-lg font-medium text-foreground mb-2 block">Age (Optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="120"
                    value={formData.age || ""}
                    onChange={(e) => updateFormData('age', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    placeholder="Enter your age"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  onClick={() => setCurrentSection(2)}
                  disabled={!formData.name || !formData.email}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-3d hover:shadow-3d-hover transition-all duration-300 rounded-xl transform hover:scale-105 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentSection === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-primary border-b-2 border-primary/30 pb-3 mb-6 drop-shadow-md">
                Section 1: Your Caregiving Journey
              </h2>
              <p className="text-muted-foreground text-lg mb-6">Tell us about your background and day-to-day life</p>
              
              
              <div className="space-y-8">
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label className="text-lg font-medium text-foreground mb-4 block">What is your relationship to the person you are caring for? *</Label>
                   <RadioGroup 
                    value={formData.relationship} 
                    onValueChange={(value) => {
                      updateFormData('relationship', value)
                      // Clear "other" text if not selecting "Other"
                      if (value !== 'Other') {
                        updateFormData('relationship_other', '')
                      }
                    }}
                    className="mt-4 space-y-4"
                  >
                    {['Spouse/Partner', 'Adult Child', 'Parent', 'Sibling', 'Other'].map((option) => (
                      <div key={option} className="flex items-center space-x-4 p-5 rounded-2xl border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-3d hover:scale-[1.02] cursor-pointer bg-card shadow-3d backdrop-blur-sm transform">
                        <RadioGroupItem value={option} id={option} className="text-primary w-5 h-5" />
                        <Label htmlFor={option} className="cursor-pointer font-medium flex-1 text-lg">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {/* Conditional input for "Other" relationship */}
                  {formData.relationship === 'Other' && (
                    <div className="mt-4 transform transition-all duration-300 hover:scale-[1.01]">
                      <Label htmlFor="relationship_other" className="text-lg font-medium text-foreground mb-2 block">Please specify your relationship *</Label>
                      <Input
                        id="relationship_other"
                        value={formData.relationship_other || ''}
                        onChange={(e) => updateFormData('relationship_other', e.target.value)}
                        className="shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                        placeholder="Enter your relationship to the care recipient"
                      />
                    </div>
                  )}
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label className="text-lg font-medium text-foreground mb-4 block">How long have you been a caregiver? *</Label>
                  <RadioGroup 
                    value={formData.duration} 
                    onValueChange={(value) => updateFormData('duration', value)}
                    className="mt-4 space-y-4"
                  >
                    {['Less than 6 months', '6-12 months', '1-3 years', '3-5 years', 'More than 5 years'].map((option) => (
                      <div key={option} className="flex items-center space-x-4 p-5 rounded-2xl border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-3d hover:scale-[1.02] cursor-pointer bg-card shadow-3d backdrop-blur-sm">
                        <RadioGroupItem value={option} id={option} className="text-primary w-5 h-5" />
                        <Label htmlFor={option} className="cursor-pointer font-medium flex-1 text-lg">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="typical_day" className="text-lg font-medium text-foreground mb-4 block">Could you walk us through a typical day? What tasks or responsibilities take the most of your time and emotional energy? *</Label>
                  <Textarea
                    id="typical_day"
                    value={formData.typical_day}
                    onChange={(e) => updateFormData('typical_day', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={5}
                    placeholder="Share as much detail as you'd like about your daily experience..."
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label className="text-lg font-medium text-foreground mb-4 block">On a scale of 1 to 10 (with 10 being the most difficult), how would you rate the overall challenge of your caregiving experience? *</Label>
                  <RadioGroup 
                    value={formData.difficulty_rating?.toString()} 
                    onValueChange={(value) => updateFormData('difficulty_rating', parseInt(value))}
                    className="mt-4 grid grid-cols-5 gap-4"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                      <div key={num} className="flex items-center justify-center p-6 rounded-2xl border-2 border-primary/20 hover:border-primary/60 transition-all duration-300 hover:shadow-3d-hover hover:scale-110 cursor-pointer bg-card shadow-3d backdrop-blur-sm transform">
                        <RadioGroupItem value={num.toString()} id={num.toString()} className="sr-only" />
                        <Label htmlFor={num.toString()} className="cursor-pointer font-bold text-xl text-center text-primary">{num}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="difficulty_reason" className="text-lg font-medium text-foreground mb-4 block">Why did you choose that number? *</Label>
                  <Textarea
                    id="difficulty_reason"
                    value={formData.difficulty_reason}
                    onChange={(e) => updateFormData('difficulty_reason', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={4}
                    placeholder="Help us understand what makes this experience challenging for you..."
                  />
                </div>
              </div>

              <div className="flex justify-between pt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentSection(1)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-3d hover:shadow-3d-hover transition-all duration-300 transform hover:scale-105 text-lg px-6 py-3 rounded-xl"
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentSection(3)}
                  disabled={!formData.relationship || !formData.duration || !formData.typical_day || !formData.difficulty_rating || !formData.difficulty_reason || (formData.relationship === 'Other' && !formData.relationship_other)}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-3d hover:shadow-3d-hover transition-all duration-300 rounded-xl transform hover:scale-105 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentSection === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-primary border-b-2 border-primary/30 pb-3 mb-6 drop-shadow-md">
                Section 2: The Emotional & Relational Landscape
              </h2>
              <p className="text-muted-foreground text-lg mb-6">Help us understand the invisible struggles and emotional bonds</p>
              
              <div className="space-y-8">
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="emotional_challenge" className="text-lg font-medium text-foreground mb-4 block">What is the most difficult emotional challenge you face as a caregiver? *</Label>
                  <Textarea
                    id="emotional_challenge"
                    value={formData.emotional_challenge}
                    onChange={(e) => updateFormData('emotional_challenge', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={4}
                    placeholder="Share what weighs on your heart the most..."
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="isolation_feeling" className="text-lg font-medium text-foreground mb-4 block">Do you ever feel a sense of isolation or loneliness in your role? If so, what does that feel like? *</Label>
                  <Textarea
                    id="isolation_feeling"
                    value={formData.isolation_feeling}
                    onChange={(e) => updateFormData('isolation_feeling', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={4}
                    placeholder="Describe those moments when you feel most alone..."
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="relationship_learning" className="text-lg font-medium text-foreground mb-4 block">What's one thing you've learned about your relationship with your loved one that you never would have known without this experience? *</Label>
                  <Textarea
                    id="relationship_learning"
                    value={formData.relationship_learning}
                    onChange={(e) => updateFormData('relationship_learning', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={4}
                    placeholder="Tell us about a discovery or insight about your bond..."
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="connection_moment" className="text-lg font-medium text-foreground mb-4 block">Tell me about a time when you and your loved one were able to connect in a simple, meaningful way. What did you do, and what did that moment feel like? *</Label>
                  <Textarea
                    id="connection_moment"
                    value={formData.connection_moment}
                    onChange={(e) => updateFormData('connection_moment', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={4}
                    placeholder="Describe that special moment of connection..."
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="love_memory" className="text-lg font-medium text-foreground mb-4 block">When you feel overwhelmed, what's a small memory or thought that you hold on to that reminds you of the love between you and your loved one? *</Label>
                  <Textarea
                    id="love_memory"
                    value={formData.love_memory}
                    onChange={(e) => updateFormData('love_memory', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={4}
                    placeholder="Share that precious memory that sustains you..."
                  />
                </div>
              </div>

              <div className="flex justify-between pt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentSection(2)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-3d hover:shadow-3d-hover transition-all duration-300 transform hover:scale-105 text-lg px-6 py-3 rounded-xl"
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentSection(4)}
                  disabled={!formData.emotional_challenge || !formData.isolation_feeling || !formData.relationship_learning || !formData.connection_moment || !formData.love_memory}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-3d hover:shadow-3d-hover transition-all duration-300 rounded-xl transform hover:scale-105 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentSection === 4 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-primary border-b-2 border-primary/30 pb-3 mb-6 drop-shadow-md">
                Section 3: Coping & Community
              </h2>
              <p className="text-muted-foreground text-lg mb-6">Tell us about your support systems and what you need</p>
              
              <div className="space-y-8">
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="coping_methods" className="text-lg font-medium text-foreground mb-4 block">What are some of the ways you have found to cope with the emotional and mental challenges of caregiving? *</Label>
                  <Textarea
                    id="coping_methods"
                    value={formData.coping_methods}
                    onChange={(e) => updateFormData('coping_methods', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={4}
                    placeholder="Share your coping strategies and what helps you through difficult moments..."
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="talk_to_whom" className="text-lg font-medium text-foreground mb-4 block">When you need to talk to someone who truly understands, who or where do you turn to? *</Label>
                  <Textarea
                    id="talk_to_whom"
                    value={formData.talk_to_whom}
                    onChange={(e) => updateFormData('talk_to_whom', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={4}
                    placeholder="Tell us about your support network or where you find understanding..."
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label className="text-lg font-medium text-foreground mb-4 block">What kinds of support systems have you used? (Select all that apply) *</Label>
                  <div className="mt-4 space-y-4">
                    {['Online support groups', 'In-person therapy', 'Friends/Family', 'Respite care', 'Nothing', 'Other'].map((system) => (
                      <div key={system} className="flex items-center space-x-4 p-5 rounded-2xl border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-3d hover:scale-[1.02] cursor-pointer bg-card shadow-3d backdrop-blur-sm">
                        <Checkbox
                          id={system}
                          checked={formData.support_systems?.includes(system) || false}
                          onCheckedChange={(checked) => handleSupportSystemChange(system, checked as boolean)}
                          className="text-primary w-5 h-5"
                        />
                        <Label htmlFor={system} className="cursor-pointer font-medium flex-1 text-lg">{system}</Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Conditional input for "Other" support systems */}
                  {formData.support_systems?.includes('Other') && (
                    <div className="mt-4 transform transition-all duration-300 hover:scale-[1.01]">
                      <Label htmlFor="support_systems_other" className="text-lg font-medium text-foreground mb-2 block">Please specify other support systems *</Label>
                      <Input
                        id="support_systems_other"
                        value={formData.support_systems_other || ''}
                        onChange={(e) => updateFormData('support_systems_other', e.target.value)}
                        className="shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                        placeholder="Describe other support systems you've used"
                      />
                    </div>
                  )}
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="missing_support" className="text-lg font-medium text-foreground mb-4 block">What do you think is the biggest thing missing for caregivers, in terms of support? What would make you feel most understood and less alone? *</Label>
                  <Textarea
                    id="missing_support"
                    value={formData.missing_support}
                    onChange={(e) => updateFormData('missing_support', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={4}
                    placeholder="Share what kind of support would make the biggest difference..."
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="extra_hour" className="text-lg font-medium text-foreground mb-4 block">If you had an extra hour in your day, what would you spend it on? *</Label>
                  <Textarea
                    id="extra_hour"
                    value={formData.extra_hour}
                    onChange={(e) => updateFormData('extra_hour', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={3}
                    placeholder="What would you do with that precious extra time?"
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Label htmlFor="lost_activity" className="text-lg font-medium text-foreground mb-4 block">What is one thing you used to love doing before caregiving that you no longer have time for? *</Label>
                  <Textarea
                    id="lost_activity"
                    value={formData.lost_activity}
                    onChange={(e) => updateFormData('lost_activity', e.target.value)}
                    className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                    rows={3}
                    placeholder="Tell us about something you miss doing..."
                  />
                </div>
              </div>

              <div className="flex justify-between pt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentSection(3)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-3d hover:shadow-3d-hover transition-all duration-300 transform hover:scale-105 text-lg px-6 py-3 rounded-xl"
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentSection(5)}
                  disabled={!formData.coping_methods || !formData.talk_to_whom || !formData.support_systems?.length || !formData.missing_support || !formData.extra_hour || !formData.lost_activity || (formData.support_systems?.includes('Other') && !formData.support_systems_other)}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-3d hover:shadow-3d-hover transition-all duration-300 rounded-xl transform hover:scale-105 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentSection === 5 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-primary border-b-2 border-primary/30 pb-3 mb-6 drop-shadow-md">
                Share More
              </h2>
              <p className="text-muted-foreground text-lg mb-6">We'd love to hear anything else you'd like to share</p>
              
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <Label htmlFor="additional_sharing" className="text-lg font-medium text-foreground mb-4 block">Is there anything else you would like to share?</Label>
                <Textarea
                  id="additional_sharing"
                  value={formData.additional_sharing}
                  onChange={(e) => updateFormData('additional_sharing', e.target.value)}
                  className="mt-2 shadow-3d hover:shadow-3d-hover focus:shadow-3d-hover border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-lg p-4 rounded-xl"
                  rows={5}
                  placeholder="Feel free to share any additional thoughts, experiences, or insights..."
                />
              </div>

              <div className="flex justify-between pt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentSection(4)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-3d hover:shadow-3d-hover transition-all duration-300 transform hover:scale-105 text-lg px-6 py-3 rounded-xl"
                >
                  Previous
                </Button>
                <Button 
                  onClick={submitSurvey}
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-3d hover:shadow-3d-hover transition-all duration-300 rounded-xl px-10 py-4 transform hover:scale-105 text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Share My Story"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// Add type declarations for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    rdt?: any
  }
}

const Survey = () => {
  return <SurveyForm />
}

export default Survey
