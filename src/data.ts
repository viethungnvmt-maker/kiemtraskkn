export type Tone = 'emerald' | 'violet' | 'pink' | 'cyan' | 'orange' | 'blue' | 'gold';

export type IconName =
  | 'shield'
  | 'history'
  | 'compare'
  | 'book'
  | 'key'
  | 'logout'
  | 'search'
  | 'upload'
  | 'spark'
  | 'share'
  | 'wand'
  | 'chart'
  | 'document'
  | 'check'
  | 'clock';

export type NavItem = {
  label: string;
  icon: IconName;
};

export type QuickAction = {
  label: string;
  icon: IconName;
  tone: Tone;
};

export type StatCard = {
  title: string;
  value: number;
  total: number;
  suffix: string;
  tone: Tone;
  status: string;
  helper: string;
};

export type Criterion = {
  label: string;
  score: number;
  total: number;
  note: string;
};

export type SourceCheck = {
  title: string;
  tone: Tone;
  detail: string;
};

export type EvaluationCard = {
  title: string;
  strengths: string;
  caution: string;
};

export type LanguageIssue = {
  type: string;
  page: string;
  suggestion: string;
};

export type UpgradePhase = {
  label: string;
  title: string;
  items: string[];
};

export const navItems: NavItem[] = [
  { label: 'Lịch sử', icon: 'history' },
  { label: 'So sánh', icon: 'compare' },
  { label: 'Hướng dẫn', icon: 'book' },
  { label: 'API Key', icon: 'key' },
];

export const quickActions: QuickAction[] = [
  { label: 'Checklist', icon: 'check', tone: 'emerald' },
  { label: 'Tài liệu TK', icon: 'document', tone: 'violet' },
  { label: 'Chia sẻ', icon: 'share', tone: 'pink' },
  { label: 'Tự động sửa', icon: 'wand', tone: 'violet' },
  { label: 'Đề xuất cải thiện', icon: 'chart', tone: 'cyan' },
  { label: 'Sửa từ đề xuất', icon: 'spark', tone: 'orange' },
  { label: 'Giảm AI (28%)', icon: 'shield', tone: 'orange' },
  { label: 'Xuất báo cáo', icon: 'document', tone: 'blue' },
];

export const statCards: StatCard[] = [
  {
    title: 'Chất lượng tổng thể',
    value: 80,
    total: 100,
    suffix: '/100 điểm',
    tone: 'emerald',
    status: 'Tốt',
    helper: 'Bố cục rõ, minh chứng tốt và có khả năng triển khai thực tế.',
  },
  {
    title: 'Nguy cơ đạo văn',
    value: 5,
    total: 100,
    suffix: 'trùng lặp',
    tone: 'pink',
    status: 'An toàn',
    helper: 'Chỉ có 1 đoạn cần rà soát thêm do gần với nguồn giải thích EdTech.',
  },
  {
    title: 'Nguy cơ AI',
    value: 28,
    total: 100,
    suffix: 'nguy cơ AI',
    tone: 'gold',
    status: 'Trung bình',
    helper: 'Văn phong còn hơi đều ở một vài đoạn lý luận và kết luận.',
  },
];

export const criteria: Criterion[] = [
  { label: 'Cấu trúc', score: 9, total: 10, note: 'Đầy đủ 3 phần chính theo quy định' },
  { label: 'Lý luận', score: 8, total: 10, note: 'Chặt chẽ, dẫn luận thuyết kiến tạo' },
  { label: 'Số liệu', score: 9, total: 10, note: 'Khảo sát minh bạch, đối chiếu rõ ràng' },
  { label: 'Khả thi', score: 8, total: 10, note: 'Có thể nhân rộng cho giáo viên khác' },
  { label: 'PPNC', score: 8, total: 10, note: 'Khảo sát, thực nghiệm và đối chứng hợp lý' },
  { label: 'Ngôn ngữ', score: 7, total: 10, note: 'Cần gọt bớt vài câu quá dài và nhịp còn đều' },
  { label: 'Thực tiễn', score: 9, total: 10, note: 'Bám sát yêu cầu chuyển đổi số ở THCS' },
  { label: 'Tính mới', score: 7, total: 10, note: 'Điểm mới có nhưng cần nhấn rõ khác biệt' },
  { label: 'Nhân rộng', score: 8, total: 10, note: 'Phù hợp cho mô hình lớp học 4.0' },
  { label: 'Hình thức', score: 7, total: 10, note: 'Còn lỗi font, khoảng cách và tiêu đề phụ' },
];

export const scoreGroups = [
  { label: 'Tính mới', score: 22, total: 30, tone: 'gold' as Tone },
  { label: 'Khả thi', score: 34, total: 40, tone: 'emerald' as Tone },
  { label: 'Khoa học', score: 16, total: 20, tone: 'violet' as Tone },
  { label: 'Hình thức', score: 8, total: 10, tone: 'orange' as Tone },
];

export const sourceChecks: SourceCheck[] = [
  { title: 'Database nội bộ', tone: 'emerald', detail: 'So sánh với 5.000+ SKKN mẫu' },
  { title: 'Internet real-time', tone: 'violet', detail: 'Quét trùng lặp lý luận nền' },
  { title: 'Web giáo dục', tone: 'gold', detail: 'voh, violet, moet.gov.vn...' },
];

export const evaluationCards: EvaluationCard[] = [
  {
    title: 'Tính mới',
    strengths:
      'Áp dụng hệ thống tri thức trên nền tảng Canva, Padlet, Google Sheet đồng bộ cho thay vì chỉ dùng Zalo đơn thuần.',
    caution:
      'Cần nhấn mạnh hơn khác biệt trước và sau dịch COVID-19, tránh để phần đổi mới nghe giống cập nhật kỹ thuật.',
  },
  {
    title: 'Khả thi',
    strengths:
      'Các bước thực hiện rất rõ, từ hướng dẫn HS đến thu thập minh chứng trong Google Form nên giáo viên khác dễ áp dụng.',
    caution:
      'Hiệu quả còn phụ thuộc mức độ ổn định thiết bị cá nhân và đường truyền ở từng lớp học.',
  },
  {
    title: 'Khoa học',
    strengths:
      'Có số liệu khảo sát trước và sau khi áp dụng, lại có dẫn luận từ thuyết kiến tạo của Piaget nên khá chắc tay.',
    caution:
      'Phần phân tích số liệu nên đi xa hơn mô tả, cần chỉ ra vì sao biến chuyển hành vi xảy ra.',
  },
];

export const languageIssues: LanguageIssue[] = [
  { type: 'Chính tả', page: 'Trang 1: "P HẦN I"', suggestion: 'PHẦN I' },
  { type: 'Chính tả', page: 'Trang 4: "ưng dung"', suggestion: 'ứng dụng' },
  { type: 'Ngữ pháp', page: 'Trang 5: "Nguyên nhân"', suggestion: 'nguyên nhân' },
  { type: 'Diễn đạt', page: 'Trang 7: câu mở đầu quá dài', suggestion: 'Tách thành 2 câu ngắn hơn' },
];

export const upgradePlan: UpgradePhase[] = [
  {
    label: 'Ngắn hạn (1-2 tuần)',
    title: 'Sửa nhanh để tăng điểm sạch',
    items: [
      'Sửa lỗi chính tả, tiêu đề phụ và chuẩn hóa khoảng cách sau dấu câu.',
      'Viết lại đoạn gần nguồn EdTech và thêm trích dẫn đúng quy chuẩn.',
      'Làm rõ 2 minh chứng đầu ra bằng ảnh sản phẩm và biểu mẫu khảo sát.',
    ],
  },
  {
    label: 'Trung hạn (1 tháng)',
    title: 'Tăng độ dày cho minh chứng',
    items: [
      'Bổ sung bảng số liệu trước/sau theo từng nhóm học sinh.',
      'Thêm nhận xét từ đồng nghiệp hoặc tổ chuyên môn để tăng độ tin cậy.',
      'Tách phần giải pháp thành từng bước nhỏ, có điều kiện áp dụng và rủi ro.',
    ],
  },
  {
    label: 'Dài hạn (2-3 tháng)',
    title: 'Chuẩn hóa để đi thi cấp cao',
    items: [
      'Xây bộ dữ liệu dùng chung cho nhiều năm học để tăng sức nặng.',
      'Mở rộng thử nghiệm cho thêm 1 khối lớp để nâng điểm nhân rộng.',
      'Hoàn thiện bản báo cáo song song với phụ lục ảnh minh chứng thực nghiệm.',
    ],
  },
];

export const toneClassMap: Record<Tone, string> = {
  emerald: 'tone-emerald',
  violet: 'tone-violet',
  pink: 'tone-pink',
  cyan: 'tone-cyan',
  orange: 'tone-orange',
  blue: 'tone-blue',
  gold: 'tone-gold',
};
