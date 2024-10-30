/** @type {import('postcss-load-config').Config} */
const config = { 
  //Statik export (statik site üretimi) için bu yapılandırma dosyasına ihtiyaç vardır, çünkü bu dosya PostCSS'in nasıl yapılandırılacağını belirler ve CSS işleme süreçlerinin doğru şekilde çalışmasını sağlar. 
  //Statik export işleminde CSS dosyaları da işlenir ve bu dosyanın yapılandırması, kullanılan CSS araçlarının doğru çalışması için gereklidir
  plugins: [  
    'tailwindcss', //Tailwind CSS'i kullanarak, CSS sınıflarını işleyen bir PostCSS eklentisidir. Tailwind CSS, bir utility-first CSS framework'üdür ve bu eklenti, Tailwind CSS yapılandırmalarını CSS'e dönüştürür.
    'autoprefixer', //CSS özelliklerine otomatik olarak tarayıcı ön ekleri ekler. Bu, CSS'in daha geniş tarayıcı uyumluluğu için gerekli olan ön ekleri ekler (örneğin, -webkit-, -moz-, vb.).
  ],
};

export default config;
