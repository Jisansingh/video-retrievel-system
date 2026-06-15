import Navbar from '../components/Navbar';
import TextSearchCard from '../components/TextSearchCard';
import ImageSearchCard from '../components/ImageSearchCard';
import VideoSearchCard from '../components/VideoSearchCard';
import { Link } from 'react-router-dom';

export default function History() {
  const textSearches = [
    {
      id: 1,
      queryType: "Semantic Query",
      date: "Oct 24, 14:20",
      query: "A cinematic shot of a drone flying over a foggy pine forest at sunrise with soft lens flare.",
      resultsCount: 128
    },
    {
      id: 2,
      queryType: "Keyword Query",
      date: "Oct 23, 09:15",
      query: "Autonomous vehicle testing urban environment nighttime pedestrian detection",
      resultsCount: 42
    }
  ];

  const imageSearches = [
    {
      id: 1,
      filename: "reference_pc_01.jpg",
      date: "Oct 22, 18:45",
      searchType: "Visual Similarity Search",
      resultsCount: 89,
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCEe-M7KHSkuxsYAdA6F_Z3IOnx5KIomX4y1VTNnjjMPJ8jWKBPCocygYv6wdo4F1BRcLqXlQMFraKD1GtJZiMxZQdjANk9vJOgKXXIXG3Mdee1g6gvl175hSSyLeiTPIBfiaREqdcAjMJhsmwnPdbTLDj7l7-_TvpaSet97sXcoRhnktjR1SIBSP91MVEyvxA3I2M3_H5VqM6n9d46i0FXgfjiPSnxQ3NCdXTQ9D2X1qeyaOzdKaJz7OThXyzEWzvYNnvCt9PCTI"
    },
    {
      id: 2,
      filename: "factory_unit_v2.png",
      date: "Oct 21, 11:30",
      searchType: "Object Detection Query",
      resultsCount: 312,
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD_jWKoEjuzmvn-Hv5tQglINqfBic9vOFlibxLP7MpyZJPItn0JP7OeP_2hMy0WCu0MhLr0grEWgzd3XPDG9AmJLhw9aAk-V83HPGo3OgUWB0HjVtIRbBVHtBEgTL1RmTDMZDqCwvqekSJqHaCoZ24_eVa5ZWRtHb9Ltxx7OL0wj10BJk8r7W93StQV_V32JIhK1VcnaDBGMlufDXFqqb94xv7Eg-c50Eos6fU_syy9SZz4emdtbR2KTzvUZR-yWNGP5h1oU9OM7I"
    }
  ];

  const videoSearches = [
    {
      id: 1,
      filename: "urban_traffic_sequence_04.mp4",
      dateInfo: "Temporal Retrieval • Oct 20, 16:50",
      indexBadge: "FAISS-HNSW INDEX",
      matchesCount: "2,410",
      duration: "0:15",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCU-O6WnO4uteFS1-rRYPx5L2ohTJ-rX_UlZLBNHjGI0Afh1skjFnfhRd8NrYkHCi_4UFDRwgyKJqugEhumEKGES5quk30PSJWBPsWIPg0SaKU6UoDEzU9F1nDsv78tGSmNc582HTGwoZQow-RVsTr0ThpehhYQO7_pzKBy-k5YcRZaF3lWvAy3-KJO4PyTKzU8Wt_Ds75p-2NhyLUD9RfwQqFyQeFS16i5xmAM87enNbdS8cuPDb6P08ARRSZb4bw1PyNqykukGlc"
    },
    {
      id: 2,
      filename: "microchip_die_scan.mov",
      dateInfo: "Frame Clustering • Oct 19, 14:10",
      indexBadge: "CLIP-VIT-L/14",
      matchesCount: "156",
      duration: "0:08",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFW4ddddiGv7FQ6e_vbsK60LypouXpazz5j1XX2uH4oCc0Pl8YVMyVFipZfCr7KIZVWRfvQf0vs2n6ivSQxPdXMUZYpQ3z32NmPJ9HvyYfuLekesMs7zDUfosTk39est9SUJq2i4STQzRDiKA7vpM84xrySzHhqIvegk-Wm8j6WdN4lQSnubM5tRVYKexeG4cCW_nIT-9LnoNlaCy1y2i2XdRxF743RYUK7gHEO5NdtRVyWsOz_ofAdN8u9c5mwaTCD_23S_qAos8"
    }
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar />
      
      <main className="pt-28 pb-12 flex-grow w-full flex flex-col max-w-screen-2xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold">History</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Review and re-run your previous queries across all retrieval modalities.
          </p>
        </div>

        <div className="flex flex-col gap-12 w-full">
          
          {/* Text Searches Section */}
          <section>
            <div className="mb-6 border-b border-outline-variant pb-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Text Searches</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {textSearches.map(search => (
                <TextSearchCard key={search.id} {...search} />
              ))}
            </div>
          </section>

          {/* Image Searches Section */}
          <section>
            <div className="mb-6 border-b border-outline-variant pb-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Image Searches</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageSearches.map(search => (
                <ImageSearchCard key={search.id} {...search} />
              ))}
            </div>
          </section>

          {/* Video Searches Section */}
          <section>
            <div className="mb-6 border-b border-outline-variant pb-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Video Searches</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videoSearches.map(search => (
                <VideoSearchCard key={search.id} {...search} />
              ))}
            </div>
          </section>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-surface-container-low dark:bg-surface-dim border-t border-outline-variant dark:border-outline mt-auto">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">Video Retrieval System</span>
            <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim hidden md:block">© 2026 Video Retrieval System.</p>
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
