import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Notice from "./models/Notice.js";
import GalleryImage from "./models/GalleryImage.js";
import SiteContent from "./models/SiteContent.js";
import FarmerForm from "./models/FarmerForm.js";

dotenv.config();

const run = async () => {
  await connectDB();
  let adminUser = await User.findOne({ role: "UNIVERSAL_ADMIN" });
  if (!adminUser) {
    adminUser = await User.create({
      name: "Universal Admin",
      mobile: "9999999999",
      password: "Admin@123",
      role: "UNIVERSAL_ADMIN",
      permissions: {
        canManageUsers: true,
        canManageFarmers: true,
        canManageVendors: true,
        canManageDealers: true,
        canManageGallery: true,
        canManageNotices: true,
        canExportData: true,
        canManageWebsite: true,
        canManageFiles: true
      }
    });
    console.log("Universal admin created: 9999999999 / Admin@123");
  } else {
    console.log("Universal admin already exists.");
    adminUser.permissions = {
      ...adminUser.permissions?.toObject?.(),
      canManageUsers: true,
      canManageFarmers: true,
      canManageVendors: true,
      canManageDealers: true,
      canManageGallery: true,
      canManageNotices: true,
      canExportData: true,
      canManageWebsite: true,
      canManageFiles: true
    };
    await adminUser.save();
  }

  const noticeCount = await Notice.countDocuments();
  if (noticeCount === 0) {
    await Notice.insertMany([
      {
        titleHi: "ड्रिप सिंचाई योजना पंजीयन प्रारंभ",
        titleEn: "Drip Irrigation Registration Open",
        descriptionHi: "कृषक भाई 15 मई तक ऑनलाइन आवेदन करें। आवश्यक दस्तावेज अपलोड करना अनिवार्य है।",
        descriptionEn: "Farmers can apply online till 15 May. Uploading required documents is mandatory.",
        createdBy: adminUser._id
      },
      {
        titleHi: "फार्म विजिट शेड्यूल जारी",
        titleEn: "Farm Visit Schedule Released",
        descriptionHi: "विकास खंड अनुसार निरीक्षण तिथियां पोर्टल पर उपलब्ध हैं।",
        descriptionEn: "Inspection dates by block are now available on the portal.",
        createdBy: adminUser._id
      }
    ]);
  }

  const galleryCount = await GalleryImage.countDocuments();
  if (galleryCount === 0) {
    await GalleryImage.insertMany([
      { title: "ड्रिप इंस्टॉलेशन", imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6", uploadedBy: adminUser._id },
      { title: "फील्ड मॉनिटरिंग", imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399", uploadedBy: adminUser._id },
      { title: "ऑर्गेनिक फार्म", imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf", uploadedBy: adminUser._id }
    ]);
  }

  const contentCount = await SiteContent.countDocuments();
  if (contentCount === 0) {
    await SiteContent.insertMany([
      {
        section: "HOME",
        titleHi: "DITYA IRRIGATION में आपका स्वागत है",
        titleEn: "Welcome to DITYA IRRIGATION",
        descriptionHi: "स्मार्ट सिंचाई, बेहतर उत्पादन और किसान केंद्रित डिजिटल प्रबंधन के लिए एकीकृत प्लेटफॉर्म।",
        descriptionEn: "An integrated platform for smart irrigation, better yield, and farmer-centric digital management.",
        imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9",
        ctaLabelHi: "हमारी सेवाएं देखें",
        ctaLabelEn: "Explore Services",
        ctaLink: "#services",
        order: 1,
        createdBy: adminUser._id
      },
      {
        section: "ABOUT",
        titleHi: "हमारे बारे में",
        titleEn: "About Us",
        descriptionHi: "हम किसानों को योजनाओं, उपकरणों और पारदर्शी ट्रैकिंग के माध्यम से समय पर सहायता प्रदान करते हैं।",
        descriptionEn: "We support farmers with schemes, tools, and transparent workflow tracking.",
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
        order: 1,
        createdBy: adminUser._id
      },
      {
        section: "SERVICE",
        titleHi: "ड्रिप सिंचाई परामर्श",
        titleEn: "Drip Irrigation Consultation",
        descriptionHi: "फसल और भूमि अनुसार उपयुक्त ड्रिप डिज़ाइन की सलाह।",
        descriptionEn: "Crop and land specific guidance for efficient drip design.",
        imageUrl: "https://images.unsplash.com/photo-1463123081488-789f998ac9c4",
        order: 1,
        createdBy: adminUser._id
      },
      {
        section: "SERVICE",
        titleHi: "अनुदान दस्तावेज सहायता",
        titleEn: "Subsidy Documentation Support",
        descriptionHi: "पंजीयन से भुगतान तक आवश्यक दस्तावेज़ प्रक्रिया में सहयोग।",
        descriptionEn: "Support through required documentation from registration to payout.",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        order: 2,
        createdBy: adminUser._id
      },
      {
        section: "TOOL",
        titleHi: "फॉर्म ट्रैकिंग टूल",
        titleEn: "Form Tracking Tool",
        descriptionHi: "हर किसान फॉर्म की स्थिति: Active, Inactive, Completed, Incomplete।",
        descriptionEn: "Track each farmer form status: Active, Inactive, Completed, Incomplete.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        order: 1,
        createdBy: adminUser._id
      },
      {
        section: "TOOL",
        titleHi: "डेटा एक्सपोर्ट टूल",
        titleEn: "Data Export Tool",
        descriptionHi: "किसी भी समय Excel में डेटा डाउनलोड करें।",
        descriptionEn: "Download data in Excel at any time.",
        imageUrl: "https://images.unsplash.com/photo-1551281044-8b2d4f2b0d18",
        order: 2,
        createdBy: adminUser._id
      },
      {
        section: "CONTACT",
        titleHi: "संपर्क करें",
        titleEn: "Contact Us",
        descriptionHi: "WhatsApp या कॉल द्वारा हमसे सीधे जुड़ें: +91 99999 99999",
        descriptionEn: "Connect directly via WhatsApp or call: +91 99999 99999",
        imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
        ctaLabelHi: "WhatsApp चैट",
        ctaLabelEn: "WhatsApp Chat",
        ctaLink: "https://wa.me/919999999999",
        order: 1,
        createdBy: adminUser._id
      }
    ]);
  }

  await FarmerForm.deleteMany({ formType: "FARMER" });
  await FarmerForm.insertMany([
      {
        formType: "FARMER",
        क्रमांक: "1",
        पंजीयन_क्रमांक: "MPH/2020/1/1670564",
        नाम: "सतीबाई",
        पिता_का_नाम: "बंशीलाल",
        जाति: "अ.जा. (SC)",
        ग्राम: "राजौर",
        ग्राम_पंचायत: "राजौर",
        कुल_रकबा: "0.67",
        लाभ_रकबा: "0.6",
        स्पेसिंग: "ड्रिप-1.2 X 0.6 मी. सब्जी",
        मोबाइल_नंबर: "9926964299",
        श्रोत: "नलकुप",
        खसरा_क्रमांक: "242/1",
        लागत: "84694",
        अनुदान: "44363",
        कृषक_अंश: "40331",
        आशय_पत्र: "2026/2/622614",
        आशय_दिनांक: "19/2/2026",
        विकास_खंड: "खातेगांव",
        कंपनी: "SV",
        कृषक_अंश_जमा: "40331",
        UTR_No: "604255602845, 604255601759",
        Date: "20/2/2026",
        AGENT: "Ravi",
        SUBMIT_DATE: "",
        swikrati_kramank: "",
        payment_date: "123456",
        saman: "Pipe Ravi ko bheje",
        status: "ACTIVE",
        createdBy: adminUser._id
      },
      {
        formType: "FARMER",
        क्रमांक: "2",
        पंजीयन_क्रमांक: "MPH/2024/6/2184149",
        नाम: "दिनेश",
        पिता_का_नाम: "जगन्नाथ",
        जाति: "अ.जा. (SC)",
        ग्राम: "रेहटी",
        ग्राम_पंचायत: "बुराड़ा( निवासी ढुलवा)",
        कुल_रकबा: "0.98",
        लाभ_रकबा: "0.9",
        स्पेसिंग: "स्प्रिंकलर - मिनी स्प्रिंकलर (8X8)",
        मोबाइल_नंबर: "9926288570",
        श्रोत: "कुआं",
        खसरा_क्रमांक: "106/3",
        लागत: "99246",
        अनुदान: "51965",
        कृषक_अंश: "47281",
        आशय_पत्र: "2026/3/628253",
        आशय_दिनांक: "26/3/2026",
        विकास_खंड: "खातेगांव",
        कंपनी: "NE",
        कृषक_अंश_जमा: "47281",
        UTR_No: "600072049751",
        Date: "27/3/2026",
        AGENT: "Mahendra sir / Jat",
        SUBMIT_DATE: "",
        swikrati_kramank: "",
        payment_date: "R@123456",
        saman: "Pipe 5/5/26 ko jat ji ko deiye",
        status: "ACTIVE",
        createdBy: adminUser._id
      },
      {
        formType: "FARMER",
        क्रमांक: "3",
        पंजीयन_क्रमांक: "MPH/2016/8/1123881",
        नाम: "फूल सिंह",
        पिता_का_नाम: "हजारी",
        जाति: "अ.जा. (SC)",
        ग्राम: "रनथा",
        ग्राम_पंचायत: "दूदवास",
        कुल_रकबा: "3.08",
        लाभ_रकबा: "1.5",
        स्पेसिंग: "स्प्रिंकलर - मिनी स्प्रिंकलर (8X8)",
        मोबाइल_नंबर: "9669399457",
        श्रोत: "नलकुप",
        खसरा_क्रमांक: "24/1",
        लागत: "153852",
        अनुदान: "65655",
        कृषक_अंश: "88197",
        आशय_पत्र: "2026/3/628254",
        आशय_दिनांक: "26/3/2026",
        विकास_खंड: "खातेगांव",
        कंपनी: "RI",
        कृषक_अंश_जमा: "88197",
        UTR_No: "430654256302, 430654660988",
        Date: "27/3/2026",
        AGENT: "Direct kisan",
        SUBMIT_DATE: "",
        swikrati_kramank: "",
        payment_date: "F@123456",
        saman: "Pipe 30 ravi se le gaye",
        status: "ACTIVE",
        createdBy: adminUser._id
      },
      {
        formType: "FARMER",
        क्रमांक: "4",
        पंजीयन_क्रमांक: "MPH/2026/3/2499057",
        नाम: "पूरण",
        पिता_का_नाम: "हरनाथ",
        जाति: "अ.जा. (SC)",
        ग्राम: "हाथीगूराडिया",
        ग्राम_पंचायत: "हाथीगूराडिया",
        कुल_रकबा: "0.53",
        लाभ_रकबा: "0.5",
        स्पेसिंग: "स्प्रिंकलर - मिनी स्प्रिंकलर (8X8)",
        मोबाइल_नंबर: "9098991586",
        श्रोत: "कुआं",
        खसरा_क्रमांक: "711, 726",
        लागत: "59770",
        अनुदान: "31305",
        कृषक_अंश: "28465",
        आशय_पत्र: "2026/3/628158",
        आशय_दिनांक: "25/3/2026",
        विकास_खंड: "बागली",
        कंपनी: "NE",
        कृषक_अंश_जमा: "28465",
        UTR_No: "600075810347",
        Date: "26/3/2026",
        AGENT: "krishi samiti adhyaksh , gadbad aaadmi , ladka , shikayatbaaj hai",
        SUBMIT_DATE: "",
        swikrati_kramank: "",
        payment_date: "",
        saman: "30 pipe free me diye 9/4/26",
        status: "INCOMPLETE",
        createdBy: adminUser._id
      }
    ]);

  await FarmerForm.deleteMany({ formType: "DEALER" });
  await FarmerForm.insertMany([
    {
      formType: "DEALER",
      क्रमांक: "0",
      पंजीयन_क्रमांक: "MPH/2024/6/2171883",
      नाम: "Mr. Mishrilal - Selected",
      पिता_का_नाम: "29/6/2024",
      जाति: "OTHER DEALER",
      ग्राम: "करोदर्मां",
      ग्राम_पंचायत: "",
      कुल_रकबा: "2.03",
      लाभ_रकबा: "2",
      स्पेसिंग: "ड्रिप-1.2 X 0.6 मी. सब्जी",
      मोबाइल_नंबर: "9575108298",
      श्रोत: "",
      खसरा_क्रमांक: "",
      लागत: "133332.1",
      अनुदान: "",
      कृषक_अंश: "0",
      आशय_पत्र: "",
      आशय_दिनांक: "",
      विकास_खंड: "खातेगांव",
      कंपनी: "NE",
      कृषक_अंश_जमा: "1",
      UTR_No: "",
      Date: "",
      AGENT: "",
      SUBMIT_DATE: "",
      swikrati_kramank: "OTHER DEALER",
      payment_date: "",
      saman: "",
      status: "ACTIVE",
      createdBy: adminUser._id
    },
    {
      formType: "DEALER",
      क्रमांक: "0",
      पंजीयन_क्रमांक: "MPH/2024/6/2170428",
      नाम: "Mr. Dwarka Prasad Sukla - Selected",
      पिता_का_नाम: "26/6/2024",
      जाति: "OTHER DEALER",
      ग्राम: "कांकरियां",
      ग्राम_पंचायत: "देवास",
      कुल_रकबा: "1.65",
      लाभ_रकबा: "1",
      स्पेसिंग: "ड्रिप-1.2 X 0.6 मी. सब्जी",
      मोबाइल_नंबर: "8719051498",
      श्रोत: "",
      खसरा_क्रमांक: "",
      लागत: "",
      अनुदान: "",
      कृषक_अंश: "0",
      आशय_पत्र: "",
      आशय_दिनांक: "",
      विकास_खंड: "खातेगांव",
      कंपनी: "NE",
      कृषक_अंश_जमा: "",
      UTR_No: "",
      Date: "",
      AGENT: "",
      SUBMIT_DATE: "",
      swikrati_kramank: "OTHER DEALER",
      payment_date: "",
      saman: "",
      status: "ACTIVE",
      createdBy: adminUser._id
    },
    {
      formType: "DEALER",
      क्रमांक: "0",
      पंजीयन_क्रमांक: "MPH/2023/7/2055221",
      नाम: "द्वारकाधीश",
      पिता_का_नाम: "12/8/2023",
      जाति: "OTHER DEALER जमीन भी कम है",
      ग्राम: "गनोरा",
      ग्राम_पंचायत: "",
      कुल_रकबा: "2.27",
      लाभ_रकबा: "2",
      स्पेसिंग: "स्प्रिंकलर - मिनी स्प्रिंकलर (8X8)",
      मोबाइल_नंबर: "9617192634",
      श्रोत: "",
      खसरा_क्रमांक: "",
      लागत: "",
      अनुदान: "",
      कृषक_अंश: "0",
      आशय_पत्र: "",
      आशय_दिनांक: "",
      विकास_खंड: "खातेगांव",
      कंपनी: "NE",
      कृषक_अंश_जमा: "1",
      UTR_No: "",
      Date: "",
      AGENT: "",
      SUBMIT_DATE: "",
      swikrati_kramank: "Other DEALERR@123456",
      payment_date: "",
      saman: "",
      status: "ACTIVE",
      createdBy: adminUser._id
    },
    {
      formType: "DEALER",
      क्रमांक: "0",
      पंजीयन_क्रमांक: "MPH/2022/8/1908132",
      नाम: "रीना बाई",
      पिता_का_नाम: "सियाराम",
      जाति: "अ.जा. (SC)",
      ग्राम: "पलासी",
      ग्राम_पंचायत: "पलासी",
      कुल_रकबा: "1.35",
      लाभ_रकबा: "1",
      स्पेसिंग: "स्प्रिंकलर - मिनी स्प्रिंकलर (8X8)",
      मोबाइल_नंबर: "8103684557",
      श्रोत: "कुआं",
      खसरा_क्रमांक: "",
      लागत: "57130",
      अनुदान: "-57130",
      कृषक_अंश: "",
      आशय_पत्र: "26/11/2025",
      आशय_दिनांक: "",
      विकास_खंड: "खातेगांव",
      कंपनी: "NE",
      कृषक_अंश_जमा: "1",
      UTR_No: "",
      Date: "",
      AGENT: "",
      SUBMIT_DATE: "",
      swikrati_kramank: "OTHER DEALER",
      payment_date: "",
      saman: "",
      status: "ACTIVE",
      createdBy: adminUser._id
    },
    {
      formType: "DEALER",
      क्रमांक: "0",
      पंजीयन_क्रमांक: "MPH/2021/10/1787457",
      नाम: "Mr. omprakash beragi - Selected",
      पिता_का_नाम: "8/11/2022",
      जाति: "रवी मीना डीलर",
      ग्राम: "गुन्नाास",
      ग्राम_पंचायत: "",
      कुल_रकबा: "5.38",
      लाभ_रकबा: "2",
      स्पेसिंग: "स्प्रिंकलर - मिनी स्प्रिंकलर (8X8)",
      मोबाइल_नंबर: "6265008319",
      श्रोत: "",
      खसरा_क्रमांक: "",
      लागत: "",
      अनुदान: "",
      कृषक_अंश: "0",
      आशय_पत्र: "",
      आशय_दिनांक: "",
      विकास_खंड: "खातेगांव",
      कंपनी: "NE",
      कृषक_अंश_जमा: "1",
      UTR_No: "",
      Date: "",
      AGENT: "RAVI MEENA",
      SUBMIT_DATE: "",
      swikrati_kramank: "OTHER DEALER",
      payment_date: "",
      saman: "",
      status: "ACTIVE",
      createdBy: adminUser._id
    }
  ]);

  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
