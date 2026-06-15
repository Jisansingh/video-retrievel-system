import { useState } from 'react';
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import LibraryVideoCard from '../components/LibraryVideoCard';
import { Link } from 'react-router-dom';

export default function Library() {
  const [activeCategory, setActiveCategory] = useState('Animals');

  const categories = [
    {
      id: 'Animals',
      title: 'Animals',
      count: 100,
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW2__qAIgmqLp2Ol74wrRXjdghLuDw4ndMJ0QCKTrKws4kzJ6HOGVnGDTnh8fDAdcH9U9i-n3ZdfRYg00mLJ44oVlhjzyOV-GMxI1f8adzl7xvOuaK47L6SN2HEJ5srseRs-jqA3w_VDoxJ_hxoL22zuTIFTeG3cm4oiliGRAVU4q4GXx4qzRbp0qZtBmN5fiu37KUt1p5UdPubJhLRa7Ie-IngRzzMNqDeRZDpOUgo9SGeDiU9w0ErCOWkAMXI5aQXLteX2L_tDI'
    },
    {
      id: 'Nature',
      title: 'Nature',
      count: 100,
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMjT9J_KjGnNkIvDd_3JnYjbVAoUdugGtiaT_ndjcJ5JrvXZRUlo24SufsQskSD04XnKUUJXT_up5g6LDB1AIpBge50VpFWoxQP7MEuEeaciNCEaKc63vPtUICuss-CpQEUpb-2oy_apt7S2lap2901qi-CaTigvpfYyMVXnP6qEYFWY6Jp9z3jAh4xSUU3G8i_5D5PR9RKeV7hUH6qGxwhtKVvI2uS0by_IweLFkMW4hoiuLLQGPIJlBzsRtsBj25DsVTj22Wb2A'
    },
    {
      id: 'Humans',
      title: 'Humans',
      count: 100,
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfgUs7CKpCVuWui23z5Dr3Dtr2latiI7Z6-MQDpYCdFOvPCP9nczF_KEceKonS254DvBari38B5ByuWsWPX83aGDz-4zqeHsOz0rEXfMCmd0SHC8StsCyHujRUzGyPLdpQ9OXhIfSFlQREsV-aFHZEhMSvtkH9LykS5SIHphbYlKr12dhTjJO6FCXYxdAb1oKpVrQ_w8EQHhWkX6eO7s5uMNAyygKV-ntZVVqMhTULLh-Z0l4tCKk6jg0Z4gEw4YZywsv5FKwia_Q'
    },
    {
      id: 'Vehicles',
      title: 'Vehicles',
      count: 100,
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTZE1uMAWD9s-qQnPZSLyumg4O7yQtMjtwS2Uaz7KPkbNlLLChlr-P1TIkjzDjWTf0vE0vUThi_eMPt6IhxNtFFedUacNYTX5hHJwAvXWFvfGmrSXfwzrWOzkTd1S-qcZDPwhiKWdegARgOYhllOdtMJS61K-nzjIhQXZRi7No61xSetWWJNAUsu4VWb8EHRXqnMfjtAcGGv41-Asu3-_6FWl1oBcTXBJxGMMikvq0ZKt7bA_UgdAjAtOb_RVUGtApGmh8qMXtlw0'
    },
    {
      id: 'Indoors',
      title: 'Indoors',
      count: 100,
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBysNWyFTOB9oYr29t2Z7Kkqi52RRsZpZaMsXN9LWsZ-ZStCjG2yeN2qhzcU2tH7fCxRE9Z5YQ6zVZOJ-iR5ggCtPIv1lQZRGRLvbUIICBPkBz5mMQkKA-cs0C1YvUetr4UdCogeCR-q6jpEEkbGRX9yE8f-E6JrfaSJdjCAIie4fqQFXu1U5IjLP1QxlPve_AtrMoXNLddK4820iHX09i3gRaRh1iXScQ6WYPR_cf0GN_hEb2EzFsCWzO1LzvNG0KrFb6T0hhr5V4'
    }
  ];

  const libraryVideos = [
    {
      id: 1,
      title: "Snow Leopard Movement",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6dl8yOeeyW51GlHw77PQzr2X0MYofT6timHgEg7yRet3c2Cdqe9nlAlSNr4YB0MWLSyT9G23miHW6I7wpMY1drZHU67fFz3Px1LH6G5vPcyE9Fl_HJ7cicPb8uggTPXv6dJU9MtP3aGA2OAXDKurEIMa6Va-bshDWJ5tEIgiMHSOAtUnmcigApKGmj3eAj0aTlh4OTzPvIcrClltJ8qKFMYTAnlk1jbgi44ONF3Ud38TiwKxGeIioiLoFIvEYL9w0iaoCHESDOhA",
      duration: "00:24",
      clipInfo: "Clip #4293 • 4K HDR"
    },
    {
      id: 2,
      title: "Whale Shark Migration",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2cgmuneWKIRlxQLTTDXcL24QcvI10J3sE5ucGRHItuHVv2RxYRq2AmLnolGgFUp3j2QmbweNG9jTQxYdx1tt8bRqz29rxgy2aVDZBBWPgMo0UYxFWZukYcUQFmruXcOwHWL4yav2uiy82ivzLmX7-C0CV5qrv116ShQFbIDR7_mAj7Mz0X3iBcHhY1htz-8DQ5-VkkZ-jWUcMPWHEXAqmAcSUR-DtTUXu1Q7CYd3kl1xyO4yYpb2g1NzGEloFlNL2H99S5To_gU8",
      duration: "01:12",
      clipInfo: "Clip #8812 • 4K"
    },
    {
      id: 3,
      title: "Eagle Hunting Dynamics",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuACCPF8bKwh4qyXza4pJGFO1NS9j2j2h1UyGzohD-mjPtp6VPX74dX2paI_uCwy_co6UEOANoui0eTzVPO90_xItb18OPp9FHW3LHVE_G-w4vH30cqQqoYsAWQGEQTo8vES2ar6QtgwZgMOY8IXFDspVBsQbgbzHOcQ-EMwzstQ2PBSv79mvyViz83V7Y6tuqbnm65T53aq-6kjtgk_krczjum4f7jM2cGXOL5xKbc2k1s6xt-G0TTZM_HCY3zquH9bu5yWcAE_Cyw",
      duration: "00:08",
      clipInfo: "Clip #1023 • Slo-Mo"
    },
    {
      id: 4,
      title: "Reptile Ocular Study",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNM3y-qJZUA7qLpBV4nhNrbJpqypB4TbQrYuGD_mcZgUppezpgVsD9P9WKcUc80ydiaheuwpEwiWPBwyo13dmATc5Fd6J0zfK2KLamt4r5dP_jP_nGz3agG3ugfLuX4TDbunIbJT8bT-rt89ITYjQd1X92bUdOEgv11pL8L3FgqY3EwRw52yzXj1coEhSne3aCEo5eFWNz7Q0giyzYpYMoZiiPLR7G1ZaZHD31l9VzZtuyYC0kYxl8vPOyy4DaZMQ25_RdA9q9Qpw",
      duration: "00:45",
      clipInfo: "Clip #5521 • Macro"
    },
    {
      id: 5,
      title: "Panda Habitat Socials",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQiwVUyKt1b2TYRHHQirZb0r-Iyzv7r27hppVZIxP0miv7UykvHP4-chZ6N8larkcpiysp55nEAaCBAki6HqVsVfWS50imvAAYOuCjtwyXNymyf5kr9rIK1tGOdPqM1JSXIVwXxn8TaVKh5xbEquUpqngSBZstrZ0lsvy1uru8gYvvL0PcAkK9kAu28rFBHq_DI0o5_vK_JxCJBPPkmDhYdK_JgmepZ1VbBObn0v4mTQN5atWqBgs1m2RJCOyonWqXKEoXbiftGeg",
      duration: "01:30",
      clipInfo: "Clip #7731 • HD"
    },
    {
      id: 6,
      title: "Elephant Herd River Crossing",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCh1BaU5X33trCt_VsHWhX2naRu5Rj_eLggR4VxI4ln2qoWMS7Lza8LRufSTHHcEjU40gZYe17N9a8wFZ61Vi3xNra-UCsJ4aNwu0fLPae3dJynyn6PZO7krOtbhecyv3VcbDiYh2n_ZgQ1Nu4RoCByFo1FUpojiqeNWx1OgOTr7VBqYpIA3KCH3XYuYleNSguaoG8xj6VPlOQHRtses6k-yrSjqsn0wvF4MpcM67xVswQg35IArG0Kd3KKsBKCOKfoHInRSmOAr8Q",
      duration: "02:05",
      clipInfo: "Clip #2209 • 4K"
    },
    {
      id: 7,
      title: "Leopard Arboreal Watch",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHqutm_TqOit2sb9I8POrencIzAaDdKwxBXzIdsllZEjK7mJ8MdDOXNjlOx5dZMcvSgiRQC60Analesn9KosfTDY_A-qAWxM-foTkJHungL197L-MVWliTpqM0B0_MamKVXEVK1MZPpNodUwYrIZGdqQP49pztSoguD88C7sNHeipVjywAhnPntmlAMi11l1WBytLzAOioniHZHzTQKwRrqW3fgX7_77Pyu7k3EFx136I_vH2E1zSjj3rd-us8dXDbvscJkH-Uwjo",
      duration: "00:58",
      clipInfo: "Clip #6610 • 4K"
    },
    {
      id: 8,
      title: "Abyssal Bioluminescence",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzaA3Al6_O5trZQf28AKJ4tXBOGuiI47ttsxckD2j1Ac7iPmiGzA9j29GRWWP91NqcNI832HcEhEEbmk71JdBYkkXLZnSf_fqIN2CylznzyvojtADcbEaORE6RdKmxZ0wZTtie_B8IKEXUSadto_TY-Zh965I0-oSMfRGEdh2AnqGMozrI8CQyylBRnjDK06areHntzt9K4d3GT0WIfUjjdVBc_3nmLdUzoZEYf8e1AbK-rQUQaUY-x_jkrSf8vbCd0zLu7RA1PwQ",
      duration: "03:15",
      clipInfo: "Clip #9901 • Ultra HD"
    }
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar />
      
      <main className="pt-28 pb-12 flex-grow w-full flex flex-col max-w-screen-2xl mx-auto px-6">
        
        {/* Categories Section */}
        <section className="mb-12 w-full">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Explore Library</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl">
              Browse curated datasets across primary categories for high-precision retrieval training and archival analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map(category => (
              <CategoryCard 
                key={category.id}
                title={category.title}
                count={category.count}
                imageSrc={category.imageSrc}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>
        </section>

        {/* Video Grid Section */}
        <section className="mt-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-outline-variant pb-6 gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{activeCategory} Collection</h3>
            </div>
            
            <div className="flex gap-4">
              <input 
                className="px-4 py-2.5 rounded-lg border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface-container-low text-on-surface w-full sm:w-64 font-body-sm"
                placeholder="Search collection..."
                type="text"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {libraryVideos.map(video => (
              <LibraryVideoCard 
                key={video.id}
                title={video.title}
                imageSrc={video.imageSrc}
                duration={video.duration}
                clipInfo={video.clipInfo}
              />
            ))}
          </div>
          
          <div className="mt-12 flex items-center justify-center">
            <button className="bg-surface-container-low border border-outline-variant text-primary font-label-md text-base px-8 py-3 rounded-lg hover:bg-surface-variant transition-all font-semibold shadow-sm hover:shadow active:scale-95">
              Load More Results
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-surface-container-low dark:bg-surface-dim border-t border-outline-variant dark:border-outline mt-auto">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">database</span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary">Video Retrieval System</span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim hidden md:block">© 2024 Video Retrieval System.</p>
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
