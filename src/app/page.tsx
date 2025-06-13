
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, PenLine, FileText, Download } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Craft Your Future: Build a Resume That Opens Doors.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Fresher Resume Builder helps you create professional, ATS-friendly resumes with ease.
          Stop worrying about formatting and start focusing on landing your dream job.
        </p>
        <Button size="lg" asChild className="font-headline">
          <Link href="/builder">Start Building Your Resume Now</Link>
        </Button>
      </section>

      <section className="py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-semibold">Why Fresher Resume Builder?</h2>
          <p className="text-muted-foreground mt-2">Everything you need to create a standout resume.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<PenLine className="w-10 h-10 text-primary mb-4" />}
            title="Intuitive Editor"
            description="Easily input your personal details, education, experience, and more with our user-friendly interface."
          />
          <FeatureCard
            icon={<FileText className="w-10 h-10 text-primary mb-4" />}
            title="ATS-Friendly Templates"
            description="Our resume structure is optimized for Applicant Tracking Systems, ensuring your resume gets seen by recruiters."
          />
          <FeatureCard
            icon={<Smile className="w-10 h-10 text-primary mb-4" />}
            title="Live Preview"
            description="See your resume take shape in real-time as you type. No surprises, just a perfect resume."
          />
          <FeatureCard
            icon={<Download className="w-10 h-10 text-primary mb-4" />}
            title="PDF Download"
            description="Download your professionally formatted resume as a PDF, ready to impress employers."
          />
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-secondary/50 rounded-lg matte-glass">
         <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="font-headline text-3xl font-semibold mb-6">Unlock Your Career Potential</h2>
                <p className="text-muted-foreground mb-4 text-lg">
                    In today's competitive job market, a well-crafted resume is more than just a document – it's your personal marketing tool. It's often the first impression a potential employer has of you.
                </p>
                <p className="text-muted-foreground mb-4 text-lg">
                    Fresher Resume Builder empowers you to present your skills and experiences in the best possible light. Our ATS-friendly design ensures your application bypasses automated filters and reaches human eyes.
                </p>
                <Button asChild className="mt-4 font-headline">
                    <Link href="/builder">Get Started for Free</Link>
                </Button>
            </div>
            <div className="relative h-64 md:h-96 w-full">
                 <Image 
                    src="https://placehold.co/600x400.png" 
                    alt="Resume building process" 
                    fill
                    className="rounded-lg shadow-xl object-cover"
                    data-ai-hint="resume computer"
                 />
            </div>
         </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="text-center matte-glass p-2">
      <CardHeader className="items-center">
        {icon}
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
