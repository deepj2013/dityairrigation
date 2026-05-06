import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { api } from "../api";
import pvcPipeImage from "../assets/WhatsApp Image 2026-05-06 at 3.04.03 PM.jpeg";
import sprinklerPipeImage from "../assets/irrigation-sprinklers-500x500.webp";
import miniSprinklerImage from "../assets/1718112762-13-dec-23.jpg";
import onlinePanjikaranImage from "../assets/WhatsApp Image 2026-05-06 at 3.04.03 PM.jpeg";
import anudanYojnaImage from "../assets/yujna.png";

const STATIC_HINDI_CONTENT = {
  about:
    "DITYA IRRIGATION किसानों के लिए आधुनिक सिंचाई और संरक्षित खेती समाधान प्रदान करता है। हमारा उद्देश्य कम पानी में अधिक उत्पादन, बेहतर खेत प्रबंधन और सही तकनीकी मार्गदर्शन देना है।",
  services: [
    {
      key: "drip-mini-provider",
      title: "ड्रिप और मिनी स्प्रिंकलर प्रदायक",
      description: "खेत की जरूरत अनुसार ड्रिप और मिनी स्प्रिंकलर उपलब्ध।",
      image: miniSprinklerImage
    },
    {
      key: "sprinkler-pipe-provider",
      title: "स्प्रिंकलर पाइप प्रदायक",
      description: "स्प्रिंकलर लाइन के लिए गुणवत्ता वाले पाइप समाधान।",
      image: sprinklerPipeImage
    },
    {
      key: "pvc-pipe-provider",
      title: "पीवीसी पाइप प्रदायक",
      description: "सिंचाई और पाइपलाइन के लिए मजबूत पीवीसी पाइप उपलब्ध।",
      image: pvcPipeImage
    },
    {
      key: "anudan-yojna-help",
      title: "अनुदान योजना हेतु सहायक",
      description: "सरकारी योजना में मार्गदर्शन और आवेदन सहायता।",
      image: anudanYojnaImage
    },
    {
      key: "online-panjikaran",
      title: "ऑनलाइन पंजीकरण करता",
      description: "किसानों का ऑनलाइन पंजीकरण और रिकॉर्ड सहायता।",
      image: onlinePanjikaranImage
    }
  ],
  tools: [
    "फार्म सर्वे और लेआउट प्लान",
    "डिजाइन, इंस्टॉलेशन और कमिशनिंग",
    "मेंटेनेंस और रिपेयर सपोर्ट",
    "योजना अनुसार तकनीकी मार्गदर्शन"
  ],
  contact: {
    name: "रमेश राजपूत",
    mobile: "8319171144",
    email: "dityairrigation@gmail.com",
    address: "रिछिया रोड, मालवीय वार्ड, सिवनी (म.प्र.)",
    whatsapp: "918319171144"
  }
};

const STATIC_ENGLISH_CONTENT = {
  about:
    "DITYA IRRIGATION provides modern irrigation and protected farming solutions for farmers. Our goal is higher yield with less water, better farm management, and practical technical guidance.",
  services: [
    { key: "drip-mini-provider", title: "Drip and Mini Sprinkler Provider", description: "Supply of drip and mini sprinkler as per farm needs.", image: miniSprinklerImage },
    { key: "sprinkler-pipe-provider", title: "Sprinkler Pipe Provider", description: "Quality sprinkler pipes for field irrigation lines.", image: sprinklerPipeImage },
    { key: "pvc-pipe-provider", title: "PVC Pipe Provider", description: "Durable PVC pipes for irrigation and pipe networks.", image: pvcPipeImage },
    { key: "anudan-yojna-help", title: "Subsidy Scheme Assistance", description: "Guidance and support for government subsidy schemes.", image: anudanYojnaImage },
    { key: "online-panjikaran", title: "Online Registration Service", description: "Farmer online registration and record support.", image: onlinePanjikaranImage }
  ],
  tools: [
    "Farm survey and layout planning",
    "Design, installation, and commissioning",
    "Maintenance and repair support",
    "Technical guidance as per scheme requirements"
  ],
  contact: {
    name: "Ramesh Rajput",
    mobile: "8319171144",
    email: "dityairrigation@gmail.com",
    address: "Richhiya Road, Malviya Ward, Seoni (M.P.)",
    whatsapp: "918319171144"
  },
  labels: {
    home: "Home",
    about: "About Us",
    services: "Services",
    tools: "Tools",
    contact: "Contact",
    login: "Login",
    notifications: "Notifications",
    documents: "Documents",
    gallery: "Gallery",
    aboutHeading: "About Us",
    contactHeading: "Contact",
    contactLine: "Contact us directly for irrigation and farm project related support.",
    name: "Name",
    mobile: "Mobile Number",
    email: "Email",
    address: "Address",
    callNow: "Call Now"
  }
};

function PublicHomePage() {
  const { i18n } = useTranslation();
  const isHindi = i18n.language !== "en";
  const content = isHindi ? STATIC_HINDI_CONTENT : STATIC_ENGLISH_CONTENT;
  const labels = isHindi
    ? {
        home: "होम",
        about: "हमारे बारे में",
        services: "सेवाएं",
        tools: "टूल्स",
        contact: "संपर्क",
        login: "लॉगिन",
        notifications: "सूचनाएं",
        documents: "दस्तावेज़",
        gallery: "गैलरी",
        aboutHeading: "हमारे बारे में",
        contactHeading: "संपर्क",
        contactLine: "कृषि सिंचाई और परियोजना संबंधी जानकारी के लिए सीधे संपर्क करें।",
        name: "नाम",
        mobile: "मोबाइल नंबर",
        email: "ईमेल",
        address: "पता",
        callNow: "कॉल करें"
      }
    : STATIC_ENGLISH_CONTENT.labels;

  const [data, setData] = useState({
    notices: [],
    gallery: [],
    home: [],
    about: [],
    services: [],
    tools: [],
    contact: [],
    documents: []
  });
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [assetHeroImages, setAssetHeroImages] = useState([]);
  const [showIntroBanner, setShowIntroBanner] = useState(true);

  useEffect(() => {
    const loadLocalHeroAssets = async () => {
      const modules = import.meta.glob("../assets/*.{png,jpg,jpeg,webp,gif,avif}");
      const imagePromises = Object.values(modules).map((loader) => loader());
      const resolved = await Promise.all(imagePromises);
      setAssetHeroImages(resolved.map((mod) => mod.default).filter(Boolean));
    };

    loadLocalHeroAssets();
  }, []);

  useEffect(() => {
    api.get("/public").then((response) => setData(response.data));
  }, []);

  useEffect(() => {
    if (assetHeroImages.length <= 1) return undefined;

    const timer = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % assetHeroImages.length);
    }, 2800);

    return () => clearInterval(timer);
  }, [assetHeroImages]);

  const activeHeroImage =
    assetHeroImages[heroImageIndex] ||
    data.gallery?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9";
  const contact = useMemo(() => STATIC_HINDI_CONTENT.contact, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {showIntroBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl md:p-6">
            <button
              onClick={() => setShowIntroBanner(false)}
              className="absolute right-3 top-3 rounded-full border border-slate-300 px-2 py-1 text-xs font-bold text-slate-600"
            >
              X
            </button>
            <h2 className="mb-4 text-center text-2xl font-black text-red-600">निःशुल्क पंजीयन</h2>
            <p className="text-lg leading-8 text-green-700">
              तार फेंसिंग, ड्रिप, मिनी स्प्रिंकलर, पाइप लाइन, प्याज हाउस, नेट हाउस, पम्प इत्यादि की विभिन्न योजनाओं
              के लिए ऑनलाइन पंजीयन शुरू हो गए हैं। निःशुल्क पंजीयन करवाने के लिए कृपया डॉक्यूमेंट व्हाट्सएप करें।
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg text-sky-700">
              <li>आधार कार्ड दोनों साइड</li>
              <li>पावती या जमीन के कागज</li>
              <li>समग्र आई डी</li>
              <li>पासपोर्ट फोटो</li>
              <li>बैंक पास बुक का प्रथम पेज</li>
              <li>जाति प्रमाण पत्र (अजा / अजजा के लिए)</li>
              <li>प्रत्येक के लिए आधार से लिंक मोबाइल नंबर</li>
            </ol>
            <p className="mt-3 text-xl font-bold text-red-600">व्हाट्सएप करें :- 8319171144 (रूपेश राजपूत, बागली)</p>
            <p className="mt-2 text-lg text-slate-800">
              नोट: तीन या चार बार ओटीपी लगेगी, केवल इसी नंबर पर पूछकर ही दें।
            </p>
            <p className="mt-2 text-lg text-slate-800">
              (कृषक ऑनलाइन लॉटरी के द्वारा चयनित किए जाएंगे, पंजीयन सात सालों के लिए होगा)
            </p>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-base font-bold text-white"
            >
              WhatsApp पर डॉक्यूमेंट भेजें
            </a>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 md:px-4">
          <div className="text-base font-black text-emerald-900 md:text-xl">DITYA IRRIGATION</div>
          <nav className="hidden gap-4 text-sm font-semibold text-slate-600 md:flex">
            <a href="#home">{labels.home}</a>
            <a href="#about">{labels.about}</a>
            <a href="#services">{labels.services}</a>
            <a href="#tools">{labels.tools}</a>
            <a href="#contact">{labels.contact}</a>
          </nav>
          <div className="flex items-center gap-1 md:gap-2">
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-green-300 bg-green-50 text-green-700"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.63 15.05L2 22l5.1-1.33A10 10 0 1 0 12 2Zm0 18.18a8.15 8.15 0 0 1-4.17-1.15l-.3-.18-3.03.79.81-2.95-.2-.31A8.18 8.18 0 1 1 12 20.18Zm4.49-6.1c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.55.12-.16.24-.62.78-.76.93-.14.16-.27.18-.5.06-.24-.12-1-.37-1.9-1.18-.7-.63-1.17-1.4-1.31-1.64-.14-.24-.01-.37.1-.5.1-.1.24-.27.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.84-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.17.86 2.3.98 2.46.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.15 1.52.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
              </svg>
            </a>
            <button
              onClick={() => i18n.changeLanguage(isHindi ? "en" : "hi")}
              className="rounded-full border border-emerald-300 px-2.5 py-1 text-xs font-semibold text-emerald-700 md:px-3 md:text-sm"
            >
              {isHindi ? "English" : "हिंदी"}
            </button>
            <Link to="/login" className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white md:px-3 md:text-sm">{labels.login}</Link>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t px-3 py-2 text-xs font-semibold text-slate-600 md:hidden">
          <a href="#home" className="shrink-0">{labels.home}</a>
          <a href="#about" className="shrink-0">{labels.about}</a>
          <a href="#services" className="shrink-0">{labels.services}</a>
          <a href="#tools" className="shrink-0">{labels.tools}</a>
          <a href="#contact" className="shrink-0">{labels.contact}</a>
        </nav>
      </header>

      <section id="home" className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-cyan-700 text-white">
        <motion.img
          key={activeHeroImage}
          src={activeHeroImage}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-[52vh] w-full object-cover md:h-[68vh]"
        />
      </section>

      <section id="about" className="mx-auto grid max-w-6xl gap-5 px-4 py-8 md:py-12 md:grid-cols-2">
        <img src={assetHeroImages[1] || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449"} className="h-72 w-full rounded-2xl object-cover" />
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold text-slate-900">{labels.aboutHeading}</h2>
          <p className="mt-3 text-slate-600">{content.about}</p>
        </div>
      </section>

      <section id="services" className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-black text-slate-900 md:text-3xl">{labels.services}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.services.map((item, index) => (
              <div key={item.key} className="rounded-2xl border bg-slate-50 p-4">
                <img src={item.image} className="h-40 w-full rounded-xl object-cover" />
                <h3 className="mt-3 font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tools" className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-black text-slate-900 md:text-3xl">{labels.tools}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {content.tools.map((item) => (
              <div key={item} className="rounded-2xl bg-white p-5 shadow">
                <h3 className="font-bold text-slate-900">{item}</h3>
                <p className="text-sm text-slate-600">
                  {isHindi
                    ? "हमारी तकनीकी टीम द्वारा खेत की आवश्यकता अनुसार समाधान।"
                    : "Practical solutions delivered by our technical team as per field requirements."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-black md:text-3xl">{labels.contactHeading}</h2>
          <p className="mt-2 text-slate-300">{labels.contactLine}</p>
          <div className="mt-3 space-y-1 text-sm text-slate-200">
            <p>{labels.name}: {contact.name}</p>
            <p>{labels.mobile}: {contact.mobile}</p>
            <p>{labels.email}: {contact.email}</p>
            <p>{labels.address}: {contact.address}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" className="rounded-full bg-green-500 px-5 py-2 font-bold text-white">WhatsApp</a>
            <a href={`tel:+91${contact.mobile}`} className="rounded-full border border-slate-400 px-5 py-2">{labels.callNow}</a>
            <a href={`mailto:${contact.email}`} className="rounded-full border border-slate-400 px-5 py-2">Email</a>
          </div>
        </div>
      </section>

      <a
        href={`https://wa.me/${contact.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp chat"
        className="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl md:bottom-5 md:right-5"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.63 15.05L2 22l5.1-1.33A10 10 0 1 0 12 2Zm0 18.18a8.15 8.15 0 0 1-4.17-1.15l-.3-.18-3.03.79.81-2.95-.2-.31A8.18 8.18 0 1 1 12 20.18Zm4.49-6.1c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.55.12-.16.24-.62.78-.76.93-.14.16-.27.18-.5.06-.24-.12-1-.37-1.9-1.18-.7-.63-1.17-1.4-1.31-1.64-.14-.24-.01-.37.1-.5.1-.1.24-.27.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.84-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.17.86 2.3.98 2.46.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.15 1.52.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </a>
    </div>
  );
}

export default PublicHomePage;
