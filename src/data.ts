import { Product, SiteContent } from './types';

export const initialSiteContent: SiteContent = {
  siteTitle: 'ឱសថស្ថាន ស្រី នាង',
  siteSubtitle: 'SREY NEANG PHARMACY',
  topNote: '✨ មានសេវាកម្មដឹកជញ្ជូនរហ័សទាន់ចិត្ត និងពិគ្រោះយោបល់ដោយឥតគិតថ្លៃ!',
  phone: '+855 070 608 394',
  telegramPhone: '+85570608394',
  hours: 'បើក 24 ម៉ោង / 7 ថ្ងៃ',
  heroBadge: 'ថ្នាំពិតប្រាកដ ១០០% និងមានគុណភាពខ្ពស់',
  heroTitle: 'ថែទាំសុខភាពគ្រួសារលោកអ្នក ដោយក្ដីស្រឡាញ់ និងការយកចិត្តទុកដាក់',
  heroDesc: 'ឱសថស្ថាន ស្រី នាង មានផ្តល់ជូននូវថ្នាំពេទ្យព្យាបាលទូទៅ សេរ៉ូមទឹកគ្រប់ប្រភេទ និងសម្ភារៈឧបករណ៍ពេទ្យស្តង់ដារ ដោយមានការពិគ្រោះយោបល់យ៉ាងត្រឹមត្រូវ។',
  heroImg: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80',
  catTitle: 'ផលិតផល និង ឱសថ',
  catSubtitle: 'ជ្រើសរើសតាមប្រភេទថ្នាំ ឬឧបករណ៍ពេទ្យដែលអ្នកត្រូវការ',
  footerBrand: 'ឱសថស្ថាន ស្រី នាង',
  footerAbout: 'ផ្តល់ជូននូវឱសថមានគុណភាពខ្ពស់ ឧបករណ៍ពេទ្យស្តង់ដារ និងសេរ៉ូមទឹកគ្រប់ប្រភេទ ដោយក្តីទុកចិត្ត និងយកចិត្តទុកដាក់បំផុតចំពោះសុខភាពអ្នកជំងឺ។',
  footerAddress: 'ព្រះរាជាណាចក្រកម្ពុជា (មានសេវាដឹកជញ្ជូន 24/7 គ្រប់ខេត្តក្រុង)'
};

export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Paracetamol 500mg (បំបាត់ការឈឺចាប់)',
    category: 'general',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'ថ្នាំបំបាត់ការឈឺចាប់ និងបន្ធូរក្តៅខ្លួនបានរហ័ស សុវត្ថិភាពខ្ពស់ ប្រើប្រាស់សម្រាប់មនុស្សពេញវ័យ និងកុមារ។'
  },
  {
    id: 2,
    name: 'Amoxicillin 500mg (ថ្នាំផ្សះ)',
    category: 'general',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
    description: 'ថ្នាំផ្សះព្យាបាលការឆ្លងរោគបាក់តេរីទូទៅ គុណភាពស្តង់ដារ ជួយសះស្បើយរហ័ស។'
  },
  {
    id: 3,
    name: 'Normal Saline 0.9% (សេរ៉ូមប្រៃ)',
    category: 'serum',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
    description: 'សេរ៉ូមប្រៃសម្រាប់បំពេញជាតិទឹកក្នុងរាងកាយ ជំនួយការលាងសម្អាតមុខរបួស និងបញ្ជូលថ្នាំ។'
  },
  {
    id: 4,
    name: 'Ringer Lactate Solution (សេរ៉ូមលឿង)',
    category: 'serum',
    price: 3.20,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    description: 'សេរ៉ូមបំពេញអេឡិចត្រូលីត រក្សាសមតុល្យជាតិទឹក និងសារធាតុរ៉ែក្នុងខ្លួនយ៉ាងមានប្រសិទ្ធភាពខ្ពស់។'
  },
  {
    id: 5,
    name: 'Glucose 5% / 10% (សេរ៉ូមស្ករ)',
    category: 'serum',
    price: 2.80,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    description: 'ផ្តល់ថាមពល ជាតិស្ករ និងជាតិទឹកដល់រាងកាយអ្នកជំងឺខ្សោយ ឬអស់កម្លាំងលឿនរហ័ស។'
  },
  {
    id: 6,
    name: 'ប្រដាប់វាស់សម្ពាធឈាមឌីជីថល (BP Monitor)',
    category: 'equipment',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    description: 'ម៉ាស៊ីនវាស់សម្ពាធឈាមស្វ័យប្រវត្តិតាមកដៃ និងដើមដៃ ត្រឹមត្រូវ ច្បាស់លាស់ ងាយស្រួលប្រើប្រាស់តាមផ្ទះ។'
  },
  {
    id: 7,
    name: 'ប្រដាប់វាស់កម្ដៅរាងកាយ (Infrared Thermometer)',
    category: 'equipment',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
    description: 'ឧបករណ៍វាស់កម្ដៅអ៊ីនហ្វ្រារ៉េដ មិនបាច់ប៉ះផ្ទាល់ លឿនទាន់ចិត្ត ក្នុងពេលត្រឹមតែ ១ វិនាទី។'
  },
  {
    id: 8,
    name: 'ឧបករណ៍វាស់កម្រិតអុកស៊ីសែន Fingertip Pulse Oximeter',
    category: 'equipment',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1631549912680-e8f000302b1f?auto=format&fit=crop&w=600&q=80',
    description: 'វាស់កម្រិតអុកស៊ីសែនក្នុងឈាម (SpO2) និងចង្វាក់បេះដូងបានយ៉ាងរហ័ស មានអេក្រង់ LED ច្បាស់។'
  },
  {
    id: 9,
    name: 'វីតាមីនសេ Vitamin C 1000mg ជំនួយប្រព័ន្ធការពារ',
    category: 'general',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80',
    description: 'គ្រាប់ថ្នាំវីតាមីនសេជួយពង្រឹងប្រព័ន្ធការពាររាងកាយ កាត់បន្ថយការផ្តាសាយ និងជួយស្បែកភ្លឺថ្លា។'
  },
  {
    id: 10,
    name: 'ប្រដាប់វាស់ជាតិស្ករក្នុងឈាម (Blood Glucose Meter)',
    category: 'equipment',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80',
    description: 'ឧបករណ៍តេស្តជាតិស្ករក្នុងឈាមយ៉ាងរហ័ស ជាមួយបន្ទះតេស្ត និងម្ជុលស្តង់ដារ ងាយស្រួលតាមដានជំងឺទឹកនោមផ្អែម។'
  }
];
