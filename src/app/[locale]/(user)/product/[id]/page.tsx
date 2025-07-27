import { notFound } from 'next/navigation'
import ProductDetailsClient from '@/components/ProductDetailsClient'
import { Code } from 'lucide-react'

interface Service {
  id: string
  name: string
  icon: React.ReactNode
  company: string
  usedBy: string
  category: string
  isPremium: boolean
  originalPrice: string
  discountedPrice: string
  savings: string
  description: string
  longDescription: string
  features: string[]
  benefits: string[]
  terms?: string
  deliveryTime: string
  rating: number
  reviews: number
}

const services: Service[] = [
  {
    id: '1',
    name: 'Chatgpt Plus',
    icon: <Code className='h-8 w-8 text-blue-600' />,
    company: 'OpenAI',
    usedBy: 'Used by 2,847 members',
    category: 'most-popular',
    isPremium: true,
    originalPrice: '$4,999',
    discountedPrice: '$2,499',
    savings: 'Save up to $2,500',
    description: `
      <div>
        <p>
          <strong>ChatGPT Plus</strong> is the premium subscription plan for OpenAI's ChatGPT, designed for users who want enhanced performance, reliability, and access to the latest features. With ChatGPT Plus, you get:
        </p>
        <ul class="list-disc ml-6 mt-2">
          <li><strong>General Availability:</strong> Enjoy ChatGPT even during peak times, with priority access to the service.</li>
          <li><strong>Faster Response Times:</strong> Experience significantly reduced wait times and quicker answers for all your queries.</li>
          <li><strong>Access to GPT-4:</strong> Use the latest and most powerful language model, GPT-4, for more accurate and nuanced responses.</li>
          <li><strong>Advanced Data Analysis:</strong> Analyze files, spreadsheets, and documents directly in ChatGPT (Code Interpreter).</li>
          <li><strong>Custom Instructions:</strong> Personalize ChatGPT’s behavior and responses to better suit your workflow and preferences.</li>
          <li><strong>Web Browsing:</strong> Get up-to-date information from the web, beyond the model’s training data.</li>
          <li><strong>Plugin Support:</strong> Extend ChatGPT’s capabilities with a growing library of third-party plugins for productivity, research, and more.</li>
          <li><strong>Priority Feature Access:</strong> Be among the first to try new features and improvements as they’re released.</li>
        </ul>
        <p class="mt-2">
          Whether you’re a professional, student, or enthusiast, ChatGPT Plus empowers you to work smarter, faster, and more creatively.
        </p>
      </div>
    `,
    longDescription: `
      <div>
        <p>
          <strong>ChatGPT Plus</strong> is the premium subscription plan for OpenAI's ChatGPT, designed for users who want enhanced performance, reliability, and access to the latest features. With ChatGPT Plus, you get:
        </p>
        <ul class="list-disc ml-6 mt-2">
          <li><strong>General Availability:</strong> Enjoy ChatGPT even during peak times, with priority access to the service.</li>
          <li><strong>Faster Response Times:</strong> Experience significantly reduced wait times and quicker answers for all your queries.</li>
          <li><strong>Access to GPT-4:</strong> Use the latest and most powerful language model, GPT-4, for more accurate and nuanced responses.</li>
          <li><strong>Advanced Data Analysis:</strong> Analyze files, spreadsheets, and documents directly in ChatGPT (Code Interpreter).</li>
          <li><strong>Custom Instructions:</strong> Personalize ChatGPT’s behavior and responses to better suit your workflow and preferences.</li>
          <li><strong>Web Browsing:</strong> Get up-to-date information from the web, beyond the model’s training data.</li>
          <li><strong>Plugin Support:</strong> Extend ChatGPT’s capabilities with a growing library of third-party plugins for productivity, research, and more.</li>
          <li><strong>Priority Feature Access:</strong> Be among the first to try new features and improvements as they’re released.</li>
        </ul>
        <p class="mt-2">
          Whether you’re a professional, student, or enthusiast, ChatGPT Plus empowers you to work smarter, faster, and more creatively.
        </p>
      </div>
    `,
    features: [
      'Priority access during peak times',
      'Faster response speeds',
      'Access to GPT-4 model',
      'Advanced data analysis (Code Interpreter)',
      'Custom instructions',
      'Web browsing capabilities',
      'Plugin support',
      'Early access to new features'
    ],
    benefits: [
      'Reliable AI access anytime',
      'Enhanced productivity',
      'More accurate and creative outputs',
      'Personalized experience',
      'Stay ahead with the latest AI tools'
    ],
    deliveryTime: 'Instant activation',
    rating: 4.9,
    reviews: 847,
    terms:
      'Subscription billed monthly. Cancel anytime. Features may evolve as OpenAI updates the service.'
  }
]

export async function generateStaticParams() {
  return services.map((service) => ({
    id: service.id
  }))
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const service = services.find((s) => s.id === id)

  if (!service) {
    notFound()
  }

  return (
    <div className='mt-16'>
      <ProductDetailsClient service={service} />
    </div>
  )
}
