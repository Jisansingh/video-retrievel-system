import Navbar from '../components/Navbar';
import SearchTabs from '../components/SearchTabs';
import VideoCard from '../components/VideoCard';
import { Link } from 'react-router-dom';

export default function Home() {
  const videoResults = [
    {
      id: 1,
      title: "Aerial Forest Mist Sequence",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhRd6yf-GOZJzIR0iTjV3Z4pdCSTX0-2Y2gxAiI2IrwTkk3q41IM-uRc5sOKdPO7SoB6fn_NmlEx81KwH2nrtVNwkp_PM0wIAwEdMEnNDp24MA3Jqkk8NjUSnECxrQ_mNokkQRSCVi8QHzg9ZTNhS7IgCV7_OE7ahuHXKqvd2zmHkHcem4VDUn6SejndGxqeEYgyrG7UR7idahB2nnmMbHvhDfjErUMOUqtXrf_u9R4hS_8awq8OVmj0N19zdMUdebYwKrjyLLRqw",
      rank: 1,
      duration: "00:42",
      score: 99.3,
      isBestMatch: true
    },
    {
      id: 2,
      title: "Mountain Range Vista",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKLoOAO3QvmjwIrryYr3lVAxgmfedPWLkmE8wUoQYk9JVETBsUgs9-eCaP-MI04Y8P3AjgJf5phFzVSBX8oxJeSUY85BhKV7esP3jrcuu3D-xWiQqmHktkJQO1T_9fmROp3ACqGTD6Jwk1zGbqJjJqU-tUs3Wy3tH0SbMj3WLXB4I_2m48Fwm5_K7fdAjNQgSRchikqIYGV7QgfnIM27ei1mH1uRFJXhStJo6sFUfO51ZQxC_EXj6c3UIQCsqseKl6-d394tw3OaI",
      rank: 2,
      duration: "01:15",
      score: 95.7,
      isBestMatch: false
    },
    {
      id: 3,
      title: "Deep Sea Bioluminescence",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs5yLEdmW1kX_1uLEa6LNgj_xy7jBFbMK4KzPrBLHqgEB54GBTSfEwI6vSM0oUzho8agECwl4P1cJhxJnCOpthUS0E9XQGPqtMBEcrEvRBkiUzuweKaV3ph-irJSYDj8HLtU3ud8IhVXhthT1u26sDf8zec4me-dytg8B2QkxyMTIwieAqX3UNOTR_L47DBg34dZnuqnqd0Qkd-AI3hAcbs8Vk1ITG7nnaiFZD0PVQOORz04RPcQIAmGu10Cex3ggj-sJgR7Zu-to",
      rank: 3,
      duration: "00:22",
      score: 88.4,
      isBestMatch: false
    },
    {
      id: 4,
      title: "Urban Twilight Timelapse",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAi4uFNx1XiN8VywoGb9uxjB1YbCK4QUMrGSL_rFhI-iKr8s1yUst0fHJgQ--ssw7__U_Oo84sugJfmHCpf6CwDTJ6wjRqv1f9bv0qKjQuIMtaPGzeY6iC6yx53dzJLrNNmbnXeVdJ-XuqYg6eJLkXPF120XiHcleyrIwFy2LpnDmBpCl1DitxikGfQuoN0ZtIiaqVWulf_mkYdU2LPE5HTDSSE8LzxH6EP7-NFC6jSKDW49Ji5rcaBOu2BCH7BfjJ-nvJ5L3n4tDE",
      rank: 4,
      duration: "03:50",
      score: 82.1,
      isBestMatch: false
    },
    {
      id: 5,
      title: "Lakeside Reflections",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3MCW34PjkgnkVOHNSWaB0rOGPhYuyzPknDoXzYpSLD6ReyTx5SCAOtlUrxpkpLbZ67_FDHzTrqiUS56CcQ_4NpDIoMOZlhcSAFaezi03l7TudgDVuHYoGd6oQx22qtORkGTS7-_WOfp6epMBtcVpRo6jYXVf12DC7llGWaqtG7RVoK8A76d5bFTSK5NR1ZSfDv8bx9HfzRFMPolK5tN6-OTEjksoo8gFKUqYPVGSGSzs2oH2MGF9AYZDpoPmuroEMHZz1HkjbteI",
      rank: 5,
      duration: "00:58",
      score: 79.9,
      isBestMatch: false
    }
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar />
      
      <main className="pt-24 pb-12 flex-grow w-full flex flex-col">
        {/* Hero Section */}
        <section className="w-full max-w-5xl mx-auto px-6 mb-12 text-center">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4">Multimodal Video Retrieval</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
            Harnessing state-of-the-art vision-language models to find specific moments across massive video archives with surgical precision.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-label-sm border border-outline-variant font-medium">CLIP ViT-B/32</span>
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-label-sm border border-outline-variant font-medium">FAISS</span>
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-label-sm border border-outline-variant font-medium">FastAPI</span>
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-label-sm border border-outline-variant font-medium">Multimodal Search</span>
          </div>
        </section>

        {/* Search Section */}
        <section className="w-full max-w-5xl mx-auto px-6 mb-16">
          <SearchTabs />
        </section>

        {/* Results Section */}
        <section className="w-full max-w-screen-2xl mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="font-headline-md text-headline-md font-bold">Retrieval Results</h2>
            <div className="flex flex-wrap gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant">
              <div className="px-4 border-r border-outline-variant">
                <p className="text-label-sm text-outline-variant uppercase tracking-wider mb-1">Model</p>
                <p className="text-label-md text-on-surface font-semibold">CLIP ViT-B/32</p>
              </div>
              <div className="px-4 border-r border-outline-variant">
                <p className="text-label-sm text-outline-variant uppercase tracking-wider mb-1">Vector Index</p>
                <p className="text-label-md text-on-surface font-semibold">FAISS</p>
              </div>
              <div className="px-4">
                <p className="text-label-sm text-outline-variant uppercase tracking-wider mb-1">Results</p>
                <p className="text-label-md text-on-surface font-semibold">5</p>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
            {videoResults.map(video => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-surface-container-low dark:bg-surface-dim border-t border-outline-variant dark:border-outline mt-auto">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">Video Retrieval System</span>
            <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim">© 2024 Video Retrieval System.</p>
          </div>
          <div className="flex items-center gap-8">
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium" to="#">Terms</Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium" to="#">Privacy</Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium" to="#">Github</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
