
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-8rem)]"> {/* Adjust height to account for header/footer */}
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

    