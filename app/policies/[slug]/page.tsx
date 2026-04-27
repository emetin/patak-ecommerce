import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "../../../components/legal/LegalPage";
import { buildPageMetadata } from "../../../lib/seo";

export const dynamic = "force-static";

type PolicyContent = {
  badge: string;
  title: string;
  description: string;
  lastUpdated?: string;
  sections: {
    title: string;
    body: string[];
  }[];
};

const POLICIES: Record<string, PolicyContent> = {
  "privacy-policy": {
    badge: "Privacy Policy",
    title: "Privacy Policy",
    description:
      "This Privacy Policy explains how Patak Textile collects, uses and protects information submitted through our website.",
    sections: [
      {
        title: "Information We Collect",
        body: [
          "We may collect personal information such as name, email address, phone number, company information, message content, newsletter subscription details and career application information when users submit forms through our website.",
          "We may also collect limited technical information such as IP address, browser type, device information, cookie records and website usage data to improve website performance, security and user experience.",
        ],
      },
      {
        title: "How We Use Information",
        body: [
          "We use submitted information to respond to inquiries, provide customer support, evaluate career applications, process business requests, manage communication activities and share relevant updates when users subscribe to communications.",
          "We may also use limited website usage data to conduct basic analysis, improve our services and ensure the secure operation of our website.",
        ],
      },
      {
        title: "Data Protection",
        body: [
          "We take reasonable administrative and technical measures to protect personal information against unauthorized access, loss, misuse, alteration or disclosure.",
          "Access to submitted information is limited to authorized team members and service providers who need the information for business purposes.",
        ],
      },
      {
        title: "Third-Party Services",
        body: [
          "Our website may use third-party services for hosting, analytics, form processing, email communication, security or operational support. These services may process limited data according to their own privacy practices.",
        ],
      },
      {
        title: "Contact",
        body: [
          "For questions about this Privacy Policy or personal data requests, please contact Patak Textile through the Contact Us page.",
        ],
      },
    ],
  },

  "terms-and-conditions": {
    badge: "Terms & Conditions",
    title: "Terms & Conditions",
    description:
      "These Terms & Conditions outline the general rules for using the Patak Textile website and requesting information from our company.",
    sections: [
      {
        title: "Website Use",
        body: [
          "By using this website, you agree to use it for lawful purposes and in a way that does not harm the website, its users or Patak Textile.",
          "The information on this website is provided for general corporate, product and service presentation purposes.",
        ],
      },
      {
        title: "Product Information",
        body: [
          "Product descriptions, images and specifications are provided for informational purposes. Actual product details may vary depending on production, availability, material selection and project requirements.",
          "For professional, wholesale or project-based orders, final product details, pricing, lead times and delivery terms should be confirmed directly with our team.",
        ],
      },
      {
        title: "Quotations and Orders",
        body: [
          "Any quotation, offer or order confirmation provided by Patak Textile may be subject to availability, production capacity, payment terms and delivery conditions.",
          "Customized, wholesale and project-based orders may have separate terms agreed between the parties.",
        ],
      },
      {
        title: "Intellectual Property",
        body: [
          "All website content, including text, images, design elements, product visuals and brand materials, belongs to Patak Textile or its licensors unless otherwise stated.",
          "Content may not be copied, reproduced, distributed or used commercially without written permission.",
        ],
      },
      {
        title: "Limitation of Liability",
        body: [
          "Patak Textile aims to keep website information accurate and updated, but does not guarantee that all content will always be complete, current or error-free.",
          "Patak Textile shall not be responsible for indirect damages arising from use of the website or reliance on general website information.",
        ],
      },
    ],
  },

  "cookie-policy": {
    badge: "Cookie Policy",
    title: "Cookie Policy",
    description:
      "This Cookie Policy explains how cookies and similar technologies may be used on the Patak Textile website.",
    sections: [
      {
        title: "What Are Cookies?",
        body: [
          "Cookies are small text files stored on a user’s device when visiting a website. They help websites function properly, remember preferences and improve user experience.",
        ],
      },
      {
        title: "How We Use Cookies",
        body: [
          "We may use cookies to support website functionality, understand visitor behavior, improve performance and provide a smoother browsing experience.",
          "Cookies may also be used for security, analytics and communication-related website improvements.",
        ],
      },
      {
        title: "Types of Cookies",
        body: [
          "Essential cookies may be used for basic website functions. Analytics cookies may help us understand how visitors interact with the website. Preference cookies may remember certain user choices.",
        ],
      },
      {
        title: "Managing Cookies",
        body: [
          "Users can manage or disable cookies through browser settings. Disabling certain cookies may affect website functionality or user experience.",
        ],
      },
      {
        title: "Updates",
        body: [
          "This Cookie Policy may be updated from time to time to reflect website, legal or operational changes.",
        ],
      },
    ],
  },

  kvkk: {
    badge: "KVKK",
    title: "Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni",
    description:
      "Bu metin, Patak Tekstil Sanayi ve Ticaret Limited Şirketi tarafından kişisel verilerin işlenmesi, saklanması ve aktarılmasına ilişkin bilgilendirme amacıyla hazırlanmıştır.",
    lastUpdated: "Son güncelleme: Ocak 2026",
    sections: [
      {
        title: "Veri Sorumlusu",
        body: [
          "Patak Tekstil Sanayi ve Ticaret Limited Şirketi olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili mevzuat kapsamında kişisel verilerinizin işlenmesi, saklanması ve aktarılmasına ilişkin olarak sizleri bilgilendirmek amacıyla bu aydınlatma metni hazırlanmıştır.",
          "Bu metin; ziyaretçilerimizi, çevrimiçi ziyaretçilerimizi, müşterilerimizi, potansiyel müşterilerimizi, tedarikçi çalışanlarımızı ve tedarikçi yetkililerimizi kapsayacak şekilde düzenlenmiştir.",
        ],
      },
      {
        title: "Kişisel Verilerin İşlenmesinde Temel İlkeler",
        body: [
          "Kişisel verileriniz; hukuka ve dürüstlük kurallarına uygun olma, doğru ve gerektiğinde güncel olma, belirli, açık ve meşru amaçlar için işlenme, işlendikleri amaçla bağlantılı, sınırlı ve ölçülü olma ilkelerine uygun olarak işlenmektedir.",
          "Kişisel verileriniz, ilgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza edilmektedir.",
        ],
      },
      {
        title: "Ziyaretçilerimize Ait Kişisel Veriler",
        body: [
          "Fiziksel ziyaretçilerimize ait kimlik bilgileri ve fiziksel mekan güvenliği bilgileri, ziyaretçi kayıtlarının oluşturulması ve takibi ile fiziksel mekan güvenliğinin sağlanması amaçlarıyla işlenebilir.",
          "Bu veriler, gerekli hallerde hukuki uyuşmazlıkların giderilmesi veya ilgili mevzuat gereği yetkili kurumlarla paylaşılabilir.",
        ],
      },
      {
        title: "Çevrimiçi Ziyaretçilerimize Ait Kişisel Veriler",
        body: [
          "Web sitemizi kullanan çevrimiçi ziyaretçilerimizin işlem güvenliği bilgileri, IP adresi, çerez kayıtları ve pazarlama bilgileri gibi verileri işlenebilir.",
          "İletişim formları, bülten aboneliği veya benzeri alanlar aracılığıyla tarafımıza iletilen kimlik ve iletişim bilgileri; iletişim faaliyetlerinin yürütülmesi, bilgi güvenliği süreçlerinin sağlanması, faaliyetlerin mevzuata uygun yürütülmesi ve web sitesi erişiminin sağlanması amaçlarıyla işlenebilir.",
        ],
      },
      {
        title: "Müşterilerimize Ait Kişisel Veriler",
        body: [
          "Gerçek kişi müşterilerimizin veya tüzel kişi müşterilerimizin yetkililerinin ve çalışanlarının kimlik, iletişim, müşteri işlemi, finans, hukuki işlem, pazarlama ve fiziksel mekan güvenliği bilgileri işlenebilir.",
          "Bu veriler; finans ve muhasebe işlerinin yürütülmesi, iş faaliyetlerinin yürütülmesi ve denetimi, lojistik faaliyetlerin yürütülmesi, satış ve satış sonrası destek süreçlerinin yürütülmesi, sözleşme süreçlerinin yürütülmesi, risk yönetimi, saklama ve arşiv faaliyetleri, iletişim faaliyetleri ve hukuki uyuşmazlıkların giderilmesi amaçlarıyla işlenebilir.",
        ],
      },
      {
        title: "Potansiyel Müşterilerimize Ait Kişisel Veriler",
        body: [
          "Potansiyel müşterilerimize ait kimlik, iletişim, müşteri işlemi, pazarlama ve fiziksel mekan güvenliği bilgileri; mal veya hizmet satış süreçlerinin yönetilmesi, sözleşme süreçlerinin yürütülmesi, pazarlama analiz çalışmaları ve fiziksel mekan güvenliği amaçlarıyla işlenebilir.",
        ],
      },
      {
        title: "Tedarikçi Çalışanları ve Yetkililerine Ait Kişisel Veriler",
        body: [
          "Tedarikçi çalışanlarımızın kimlik, iletişim, fiziksel mekan güvenliği ve mesleki deneyim bilgileri; iletişim faaliyetleri, iş faaliyetlerinin yürütülmesi ve denetimi, tedarik zinciri yönetimi, lojistik süreçler, iş sağlığı ve güvenliği faaliyetleri ve mevzuata uyum amaçlarıyla işlenebilir.",
          "Tedarikçi yetkililerimizin kimlik, iletişim, müşteri işlemi, finans, hukuki işlem, pazarlama ve fiziksel mekan güvenliği bilgileri; mal veya hizmet satın alım süreçleri, sözleşme süreçleri, finans ve muhasebe işleri, yatırım süreçleri ve hukuk işlerinin takibi amaçlarıyla işlenebilir.",
        ],
      },
      {
        title: "Kişisel Verilerin Toplanma Yöntemleri",
        body: [
          "Kişisel verileriniz; sipariş formları, sözleşmeler, ziyaretçi formları gibi fiziki yollarla veya bilgi sistemleri, elektronik cihazlar, telekomünikasyon altyapısı, bilgisayarlar, telefonlar, üçüncü taraflar, web sitemiz ve ilgili kişi tarafından beyan edilen belgeler aracılığıyla toplanabilir.",
          "Toplama işlemi, otomatik veya otomatik olmayan yöntemlerle gerçekleştirilebilir.",
        ],
      },
      {
        title: "Kişisel Verilerin İşlenmesinin Hukuki Sebepleri",
        body: [
          "Kişisel verileriniz; kanunlarda açıkça öngörülmesi, bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi, bir hakkın tesisi, kullanılması veya korunması için zorunlu olması ve veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması hukuki sebeplerine dayanılarak işlenebilir.",
          "Gerekli hallerde açık rıza alınması gereken süreçlerde ayrıca ilgili kişinin açık rızasına başvurulabilir.",
        ],
      },
      {
        title: "Kişisel Verilerin Aktarılması",
        body: [
          "Kişisel verileriniz, yasal düzenlemelerin öngördüğü kapsamda ve işleme amaçlarıyla sınırlı olarak yetkili kamu kurum ve kuruluşlarına, adli makamlara, kolluk kuvvetlerine, topluluk şirketlerine, bilişim hizmeti sağlayıcılarına, tedarikçilere, kargo şirketlerine, sigorta şirketlerine, bankalara, mali müşavirlere ve hukuk hizmeti alınan taraflara aktarılabilir.",
          "Aktarımlar; faaliyetlerin mevzuata uygun yürütülmesi, hizmetlerin gereği gibi ifa edilmesi, hukuk işlerinin takibi, finans ve muhasebe süreçleri, lojistik faaliyetler, risk yönetimi ve hukuki uyuşmazlıklarda delil oluşturulması amaçlarıyla yapılabilir.",
        ],
      },
      {
        title: "Yurt Dışına Aktarım",
        body: [
          "Patak Tekstil Sanayi ve Ticaret Limited Şirketi, kurumsal genel aydınlatma metninde kişisel verilerin yurt dışına aktarılmadığını belirtmektedir.",
          "Bununla birlikte, ilerleyen dönemlerde kullanılan teknik altyapı, yazılım, bulut servisleri veya üçüncü taraf hizmetlerde değişiklik olması halinde, ilgili mevzuat kapsamında gerekli bilgilendirmeler yapılabilir.",
        ],
      },
      {
        title: "İletişim Formunda İşlenen Kişisel Veriler",
        body: [
          "Web sitemizdeki iletişim formu aracılığıyla paylaşılan ad soyad, telefon, e-posta ve mesaj içeriği gibi kişisel veriler; ürün ve hizmetlerden ilgili kişileri faydalandırmak, iş süreçlerini yürütmek ve başvuruda bulunulan konu hakkında iletişim kurmak amacıyla işlenmektedir.",
          "İletişim formu üzerinden bilmemizi istemediğiniz kişisel verileri veya özel nitelikli kişisel verileri paylaşmamanızı tavsiye ederiz.",
          "İletişim formu kapsamında işlenen kişisel veriler, hukuki uyuşmazlıklarda ilgili yargı mercileriyle paylaşılabilir.",
        ],
      },
      {
        title: "Açık Rıza ve İzin Kapsamında İşlenen Veriler",
        body: [
          "Açık rıza veya izin gerektiren hallerde; ad soyad, adres, telefon numarası, e-posta adresi, ödeme, fatura ve finansal bilgiler gibi verileriniz, ilgili metinlerde belirtilen amaçlar doğrultusunda işlenebilir.",
          "Bu veriler; hizmetlerin sunulması, insan kaynakları süreçlerinin yürütülmesi, faturalandırma, hizmet geliştirme, kurumsal iletişim, bilgilendirme, raporlama ve mevzuattan doğan yükümlülüklerin yerine getirilmesi amaçlarıyla kullanılabilir.",
        ],
      },
      {
        title: "KVKK Kapsamındaki Haklarınız",
        body: [
          "KVKK’nın 11. maddesi kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme haklarına sahipsiniz.",
          "Ayrıca kişisel verilerinizin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri öğrenme, eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme, işlenmesini gerektiren sebeplerin ortadan kalkması halinde silinmesini, yok edilmesini veya anonim hale getirilmesini isteme haklarına sahipsiniz.",
          "İşlenen verilerin münhasıran otomatik sistemler aracılığıyla analiz edilmesi sonucunda aleyhinize bir sonucun ortaya çıkmasına itiraz edebilir ve kişisel verilerinizin kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep edebilirsiniz.",
        ],
      },
      {
        title: "Başvuru Yöntemi",
        body: [
          "KVKK kapsamındaki taleplerinizi yazılı ve imzalı olarak, noter aracılığıyla, güvenli elektronik imza, mobil imza, kayıtlı elektronik posta veya sistemlerimizde kayıtlı bulunan elektronik posta adresiniz üzerinden iletebilirsiniz.",
          "Başvurularınızın hızlı ve doğru değerlendirilebilmesi için kimliğinizi tespit etmeye yarayan bilgileri ve kullanmak istediğiniz hakkınıza ilişkin açıklamaları başvurunuzda belirtmeniz gerekmektedir.",
          "Başvurular, talebin niteliğine göre en kısa sürede ve en geç otuz gün içinde yazılı veya elektronik ortamda cevaplandırılır.",
        ],
      },
      {
        title: "Başvuru Adresi ve İletişim",
        body: [
          "Veri Sorumlusu: Patak Tekstil Sanayi ve Ticaret Limited Şirketi.",
          "Adres: 648/1 Sokak Evora Konutları C1 Blok 9/A Kat:17 No:156 Merkezefendi / Denizli.",
          "E-posta: birdal@globaltexusa.com.",
          "Başvuru yapılırken zarf veya e-posta konu kısmına “Kişisel Verilerin Korunması Kanunu Kapsamında Bilgi Talebi” ifadesinin eklenmesi önerilir.",
        ],
      },
    ],
  },

  "return-policy": {
    badge: "Return Policy",
    title: "Return Policy",
    description:
      "This Return Policy explains the general return process for eligible Patak Textile products.",
    sections: [
      {
        title: "Return Eligibility",
        body: [
          "Return eligibility may depend on product type, order content, customization status and condition of the product.",
          "Products generally need to be unused, clean, undamaged and in their original packaging to be considered for return.",
        ],
      },
      {
        title: "Customized Orders",
        body: [
          "Customized, made-to-order, embroidered or project-specific textile products may not be eligible for return unless there is a confirmed production defect or another agreed condition.",
        ],
      },
      {
        title: "Return Request Process",
        body: [
          "Customers should contact Patak Textile before returning any product. Our team will review the request and provide return instructions if the product is eligible.",
        ],
      },
      {
        title: "Inspection",
        body: [
          "Returned products may be inspected before any refund, replacement or credit is approved. Items that are used, damaged or not in original condition may be rejected.",
        ],
      },
      {
        title: "Shipping Costs",
        body: [
          "Return shipping costs may vary depending on the reason for return, customer location and order terms. These details will be confirmed during the return request process.",
        ],
      },
    ],
  },
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];

  if (!policy) {
    return buildPageMetadata({
      title: "Policy",
      description: "Patak Textile policy page.",
      path: "/policies",
    });
  }

  return buildPageMetadata({
    title: policy.title,
    description: policy.description,
    path: `/policies/${slug}`,
  });
}

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({
    slug,
  }));
}

export default async function PolicyPage({ params }: PageProps) {
  const { slug } = await params;
  const policy = POLICIES[slug];

  if (!policy) {
    notFound();
  }

  return <LegalPage {...policy} />;
}