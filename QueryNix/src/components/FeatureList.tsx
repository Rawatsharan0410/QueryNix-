
import { motion } from 'framer-motion';
import { MessageSquare, Search, Code, Image, Video, Mic, FileText, Clock, Globe, BookOpen } from 'lucide-react';
import { StaggerChildren } from './Transitions';

const features = [
  {
    icon: <MessageSquare className="h-6 w-6 text-querynix-500" />,
    title: 'AI Chatbot',
    description: 'Intelligent assistant for natural conversations and complex questions',
    status: 'available',
  },
  {
    icon: <Search className="h-6 w-6 text-querynix-500" />,
    title: 'AI Search',
    description: 'Intelligent web search with relevant information filtering',
    status: 'available',
  },
  {
    icon: <Code className="h-6 w-6 text-querynix-500" />,
    title: 'Code Generator',
    description: 'Generate, optimize and debug code in multiple languages',
    status: 'available',
  },
  {
    icon: <Image className="h-6 w-6 text-querynix-500" />,
    title: 'Image Generator',
    description: 'Create high-quality AI images from text descriptions',
    status: 'available',
  },
  {
    icon: <Video className="h-6 w-6 text-querynix-500" />,
    title: 'Video Creator',
    description: 'Convert text into engaging videos with voiceovers',
    status: 'available',
  },
  {
    icon: <Mic className="h-6 w-6 text-querynix-500" />,
    title: 'Voice Generator',
    description: 'Realistic AI voices with emotion control and languages',
    status: 'available',
  },
  {
    icon: <FileText className="h-6 w-6 text-querynix-500" />,
    title: 'Writing Assistant',
    description: 'Generate content, check grammar and summarize text',
    status: 'available',
  },
  {
    icon: <Clock className="h-6 w-6 text-querynix-500" />,
    title: 'Productivity Suite',
    description: 'AI-powered task manager with smart reminders',
    status: 'available',
  },
  {
    icon: <Globe className="h-6 w-6 text-querynix-500" />,
    title: 'Translator',
    description: 'Real-time translation across 100+ languages',
    status: 'available',
  },
  {
    icon: <BookOpen className="h-6 w-6 text-querynix-500" />,
    title: 'Recommendations',
    description: 'Personalized content and product suggestions',
    status: 'available',
  }
];

const FeatureList = () => {
  return (
    <div className="mb-16">
      <div className="text-center">
        <div className="mb-2 inline-block rounded-full bg-querynix-100 px-3 py-1 text-xs font-medium text-querynix-800 dark:bg-querynix-900/50 dark:text-querynix-300">
          Platform Features
        </div>
        <h2 className="text-balance font-display text-3xl font-medium tracking-tight md:text-4xl">
          All-in-one AI solution
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
          QueryNix integrates multiple AI capabilities in one powerful platform,
          designed to streamline your workflow and boost productivity.
        </p>
      </div>
      
      <StaggerChildren className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-md"
            whileHover={{ y: -5 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              {feature.icon}
            </div>
            
            <h3 className="mt-4 font-display font-medium">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            
            <div className="mt-3 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Available now
            </div>
            
            <div className="absolute -bottom-1 -right-1 h-16 w-16 -rotate-12 bg-gradient-to-br from-querynix-100 to-querynix-100/0 opacity-0 transition-opacity group-hover:opacity-100 dark:from-querynix-800/20 dark:to-transparent"></div>
          </motion.div>
        ))}
      </StaggerChildren>
    </div>
  );
};

export default FeatureList;