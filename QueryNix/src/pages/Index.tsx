
import { useEffect } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import FeatureList from '@/components/FeatureList';
import { FadeIn, SlideIn, SlideUp } from '@/components/Transitions';

const Index = () => {
  useEffect(() => {
    // Apply mesh background based on theme
    const updateBackground = () => {
      const isDark = document.documentElement.classList.contains('dark');
      document.body.classList.toggle('bg-mesh-light', !isDark);
      document.body.classList.toggle('bg-mesh-dark', isDark);
    };
    
    updateBackground();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateBackground);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 px-4 pb-20 pt-28">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section */}
          <section className="mb-20 text-center">
            <SlideUp delay={0.1} className="mb-4">
              <div className="mx-auto mb-4 inline-block rounded-full bg-querynix-100 px-3 py-1 text-sm font-medium text-querynix-800 dark:bg-querynix-900/50 dark:text-querynix-300">
                Introducing QueryNix
              </div>
              
              <h1 className="text-balance font-display text-5xl font-medium tracking-tight md:text-6xl lg:text-7xl">
                Your All-in-One
                <br />
                <span className="bg-gradient-to-r from-querynix-500 to-querynix-700 bg-clip-text text-transparent">
                  AI Platform
                </span>
              </h1>
            </SlideUp>
            
            <SlideUp delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-xl text-muted-foreground">
                QueryNix integrates multiple AI functionalities into a single,
                powerful application designed for maximum efficiency and intelligence.
              </p>
            </SlideUp>
          </section>
          
          {/* Chat Demo Section */}
          <section id="chat" className="mb-24">
            <div className="mx-auto max-w-5xl">
              <ChatInterface />
            </div>
          </section>
          
          {/* Features Section */}
          <section id="features" className="py-16">
            <FeatureList />
          </section>
          
          {/* Call to Action */}
          <section className="mb-16">
            <FadeIn>
              <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-querynix-600 to-querynix-800 p-1">
                <div className="rounded-2xl bg-background p-8 text-center backdrop-blur-sm sm:p-12">
                  <h2 className="text-balance font-display text-3xl font-medium tracking-tight md:text-4xl">
                    Experience the future of AI with QueryNix
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
                    Join thousands of users who are already using QueryNix to boost their productivity
                    and creativity with the power of artificial intelligence.
                  </p>
                </div>
              </div>
            </FadeIn>
          </section>
        </div>
      </main>
      
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/575e00fa-6288-44cd-bef2-59eabd368ae4.png" 
              alt="QueryNix Logo" 
              className="h-12 w-12 object-contain"
            />
            <div className="ml-2 font-display text-lg font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-querynix-500 to-querynix-700 bg-clip-text text-transparent">Query</span>
              <span>Nix</span>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            © {new Date().getFullYear()} QueryNix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
