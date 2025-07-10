import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { Code, Megaphone, Search, Palette, PenTool, Users } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  company: string;
  usedBy: string;
  category: string;
  isPremium: boolean;
  originalPrice: string;
  discountedPrice: string;
  savings: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  terms?: string;
  deliveryTime: string;
  rating: number;
  reviews: number;
}

const services: Service[] = [
  {
    id: 'web-development',
    name: 'Custom Web Development',
    icon: <Code className='h-8 w-8 text-blue-600' />,
    company: 'WebCraft Pro',
    usedBy: 'Used by 2,847 members',
    category: 'most-popular',
    isPremium: true,
    originalPrice: '$4,999',
    discountedPrice: '$2,499',
    savings: 'Save up to $2,500',
    description: 'Professional web development services with modern frameworks',
    longDescription:
      'Get a fully custom, responsive website built with cutting-edge technologies. Our expert developers will create a stunning, high-performance website tailored to your business needs. From concept to deployment, we handle everything including design, development, testing, and optimization.',
    features: [
      'Custom design & development',
      'Mobile-responsive layout',
      'SEO optimization',
      'Performance optimization',
      '3 months free support',
      'SSL certificate included',
      'Content management system',
      'Analytics integration'
    ],
    benefits: [
      'Increase online presence',
      'Improve user experience',
      'Boost conversion rates',
      'Professional brand image',
      'Mobile-first approach',
      'Search engine friendly'
    ],
    deliveryTime: '2-4 weeks',
    rating: 4.9,
    reviews: 847,
    terms:
      'Limited time offer. Valid for new projects only. 50% deposit required to start.'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing Suite',
    icon: <Megaphone className='h-8 w-8 text-orange-600' />,
    company: 'MarketBoost',
    usedBy: 'Used by 1,923 members',
    category: 'premium',
    isPremium: true,
    originalPrice: '$3,999',
    discountedPrice: '$1,999',
    savings: 'Save up to $2,000',
    description: 'Complete digital marketing platform for growing businesses',
    longDescription:
      'Comprehensive digital marketing package that includes everything you need to grow your online presence. Our team of marketing experts will create and execute a customized strategy across all digital channels to maximize your ROI and drive sustainable growth.',
    features: [
      'Social media management',
      'Content creation & strategy',
      'Paid advertising campaigns',
      'Analytics & reporting',
      'Email marketing automation',
      'Influencer outreach',
      'Brand monitoring',
      'Competitor analysis'
    ],
    benefits: [
      'Increase brand awareness',
      'Generate quality leads',
      'Improve customer engagement',
      'Higher conversion rates',
      'Better ROI tracking',
      'Consistent brand messaging'
    ],
    deliveryTime: '1-2 weeks setup',
    rating: 4.8,
    reviews: 623,
    terms:
      '3-month minimum commitment required. Results may vary based on industry and competition.'
  },
  {
    id: 'seo-optimization',
    name: 'SEO Optimization',
    icon: <Search className='h-8 w-8 text-green-600' />,
    company: 'RankMaster',
    usedBy: 'Used by 3,156 members',
    category: 'most-popular',
    isPremium: false,
    originalPrice: '$2,999',
    discountedPrice: '$1,499',
    savings: 'Save up to $1,500',
    description: 'Advanced SEO tools and optimization services',
    longDescription:
      'Complete SEO audit and optimization service to improve your search engine rankings and drive organic traffic. Our SEO experts use proven strategies and the latest tools to help your website rank higher on Google and other search engines.',
    features: [
      'Comprehensive SEO audit',
      'Keyword research & strategy',
      'On-page optimization',
      'Link building campaign',
      'Technical SEO fixes',
      'Local SEO optimization',
      'Content optimization',
      'Monthly progress reports'
    ],
    benefits: [
      'Higher search rankings',
      'Increased organic traffic',
      'Better online visibility',
      'Long-term sustainable growth',
      'Improved user experience',
      'Higher click-through rates'
    ],
    deliveryTime: '3-6 months',
    rating: 4.7,
    reviews: 1156,
    terms:
      'Results typically visible within 3-6 months. Ongoing optimization recommended.'
  },
  {
    id: 'brand-design',
    name: 'Brand Identity Design',
    icon: <Palette className='h-8 w-8 text-purple-600' />,
    company: 'DesignStudio',
    usedBy: 'Used by 892 members',
    category: 'premium',
    isPremium: true,
    originalPrice: '$2,599',
    discountedPrice: '$1,299',
    savings: 'Save up to $1,300',
    description: 'Professional brand identity and design services',
    longDescription:
      'Complete brand identity package that establishes a strong, memorable brand presence. Our creative team will work with you to develop a cohesive visual identity that reflects your values and resonates with your target audience.',
    features: [
      'Logo design & variations',
      'Brand color palette',
      'Typography guidelines',
      'Marketing materials',
      'Business card design',
      'Letterhead & envelope',
      'Brand style guide',
      'Social media templates'
    ],
    benefits: [
      'Professional brand image',
      'Consistent brand identity',
      'Memorable visual presence',
      'Competitive advantage',
      'Increased brand recognition',
      'Enhanced credibility'
    ],
    deliveryTime: '1-3 weeks',
    rating: 4.9,
    reviews: 392,
    terms:
      'Includes 3 revision rounds. Additional revisions available at extra cost.'
  },
  {
    id: 'content-creation',
    name: 'Content Creation Package',
    icon: <PenTool className='h-8 w-8 text-indigo-600' />,
    company: 'ContentCraft',
    usedBy: 'Used by 1,567 members',
    category: 'free',
    isPremium: false,
    originalPrice: '$1,999',
    discountedPrice: '$999',
    savings: 'Save up to $1,000',
    description: 'Professional content creation for all your marketing needs',
    longDescription:
      'High-quality content creation service that helps you engage your audience and establish thought leadership. Our team of experienced writers and content strategists will create compelling content that drives engagement and conversions.',
    features: [
      '10 blog articles',
      '20 social media posts',
      'Email newsletter templates',
      'SEO-optimized content',
      'Content calendar',
      'Graphic design elements',
      'Video scripts',
      'Press release templates'
    ],
    benefits: [
      'Engage your audience',
      'Improve SEO rankings',
      'Establish thought leadership',
      'Consistent content flow',
      'Higher engagement rates',
      'Better brand storytelling'
    ],
    deliveryTime: '2-4 weeks',
    rating: 4.6,
    reviews: 567,
    terms: 'Content delivered over 4 weeks. Revisions included for each piece.'
  },
  {
    id: 'business-consulting',
    name: 'Business Consulting',
    icon: <Users className='h-8 w-8 text-teal-600' />,
    company: 'ConsultPro',
    usedBy: 'Used by 743 members',
    category: 'recently-added',
    isPremium: true,
    originalPrice: '$3,599',
    discountedPrice: '$1,799',
    savings: 'Save up to $1,800',
    description: 'Strategic business consulting to accelerate your growth',
    longDescription:
      'Comprehensive business consulting service designed to help you overcome challenges and accelerate growth. Our experienced consultants will analyze your business, identify opportunities, and provide actionable strategies for success.',
    features: [
      'Business analysis & audit',
      'Growth strategy development',
      'Process optimization',
      'Weekly consulting sessions',
      'Performance metrics setup',
      'Market research',
      'Competitive analysis',
      'Implementation roadmap'
    ],
    benefits: [
      'Accelerate business growth',
      'Optimize operations',
      'Increase profitability',
      'Strategic advantage',
      'Better decision making',
      'Risk mitigation'
    ],
    deliveryTime: '8 weeks program',
    rating: 4.8,
    reviews: 243,
    terms: '8-week program with weekly sessions. Additional support available.'
  }
];

export async function generateStaticParams() {
  return services.map((service) => ({
    id: service.id
  }));
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const service = services.find((s) => s.id === resolvedParams.id);

  if (!service) {
    notFound();
  }

  return <ProductDetailsClient service={service} />;
}
