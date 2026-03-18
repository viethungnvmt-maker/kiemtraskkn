import { useEffect, useRef, useState } from 'react';
import './App.css';
import {
  criteria,
  evaluationCards,
  languageIssues,
  navItems,
  quickActions,
  scoreGroups,
  sourceChecks,
  statCards,
  toneClassMap,
  upgradePlan,
  type Criterion,
  type QuickAction,
  type StatCard,
} from './data';
import { Icon } from './icons';

function clampPercent(value: number, total: number) {
  return Math.max(0, Math.min(100, (value / total) * 100));
}

function radarPoints(items: Criterion[]) {
  const visibleItems = items.slice(0, 8);
  const center = 110;
  const radius = 82;

  return visibleItems
    .map((item, index) => {
      const angle = (Math.PI * 2 * index) / visibleItems.length - Math.PI / 2;
      const scaledRadius = radius * (item.score / item.total);
      const x = center + Math.cos(angle) * scaledRadius;
      const y = center + Math.sin(angle) * scaledRadius;
      return `${x},${y}`;
    })
    .join(' ');
}

function gridPolygon(level: number, sides: number) {
  const center = 110;
  const radius = 82 * level;

  return Array.from({ length: sides }, (_, index) => {
    const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    return `${x},${y}`;
  }).join(' ');
}

function AxisLabels({ items }: { items: Criterion[] }) {
  const visibleItems = items.slice(0, 8);
  const center = 110;
  const radius = 102;

  return (
    <>
      {visibleItems.map((item, index) => {
        const angle = (Math.PI * 2 * index) / visibleItems.length - Math.PI / 2;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;

        return (
          <text
            key={item.label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="radar-label"
          >
            {item.label}
          </text>
        );
      })}
    </>
  );
}

function QuickActionButton({ action }: { action: QuickAction }) {
  return (
    <button className={`quick-action ${toneClassMap[action.tone]}`} type="button">
      <span className="icon-wrap">
        <Icon name={action.icon} />
      </span>
      <span>{action.label}</span>
    </button>
  );
}

function RingCard({ card }: { card: StatCard }) {
  const dash = clampPercent(card.value, card.total) * 2.64;

  return (
    <article className={`panel stat-card ${toneClassMap[card.tone]}`}>
      <p className="panel-kicker">{card.title}</p>
      <div className="ring-card">
        <svg viewBox="0 0 120 120" className="ring-chart" aria-hidden="true">
          <circle cx="60" cy="60" r="42" className="ring-track" />
          <circle
            cx="60"
            cy="60"
            r="42"
            className="ring-progress"
            style={{ strokeDasharray: `${dash} 264` }}
          />
        </svg>
        <div className="ring-content">
          <strong>{card.value}</strong>
          <span>{card.suffix}</span>
        </div>
      </div>
      <span className="status-pill">{card.status}</span>
      <p className="card-helper">{card.helper}</p>
    </article>
  );
}

function RadarChart() {
  const visibleItems = criteria.slice(0, 8);

  return (
    <article className="panel chart-panel">
      <div className="section-heading">
        <h3>Tổng quan tiêu chí</h3>
        <p>Biểu đồ radar mô phỏng điểm các trục thẩm định cốt lõi.</p>
      </div>
      <svg viewBox="0 0 220 220" className="radar-chart" aria-label="Biểu đồ radar tổng quan">
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <polygon key={level} points={gridPolygon(level, visibleItems.length)} className="radar-grid" />
        ))}
        {visibleItems.map((item, index) => {
          const angle = (Math.PI * 2 * index) / visibleItems.length - Math.PI / 2;
          const x = 110 + Math.cos(angle) * 82;
          const y = 110 + Math.sin(angle) * 82;
          return <line key={item.label} x1="110" y1="110" x2={x} y2={y} className="radar-axis" />;
        })}
        <polygon points={radarPoints(criteria)} className="radar-area" />
        <polygon points={radarPoints(criteria)} className="radar-outline" />
        <AxisLabels items={criteria} />
      </svg>
    </article>
  );
}

function BarChart() {
  return (
    <article className="panel chart-panel">
      <div className="section-heading">
        <h3>Chi tiết điểm số</h3>
        <p>Nhìn nhanh để thấy nhóm cần ưu tiên chỉnh là ngôn ngữ, tính mới và hình thức.</p>
      </div>
      <div className="bar-chart" role="img" aria-label="Biểu đồ cột chi tiết điểm số">
        {criteria.map((item) => (
          <div key={item.label} className="bar-item">
            <div className="bar-track">
              <div
                className={`bar-fill ${item.score >= 8 ? 'is-strong' : 'is-warn'}`}
                style={{ height: `${clampPercent(item.score, item.total)}%` }}
              />
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

type ApiSettings = {
  apiKey: string;
  model: string;
};

type ApiModelOption = {
  id: string;
  name: string;
  description: string;
  badge?: {
    label: string;
    tone: 'success' | 'warning';
  };
};

const API_STORAGE_KEY = 'skkn-api-settings';
const defaultApiModel = 'gemini-2-5-flash-lite';
const apiModelOptions: ApiModelOption[] = [
  {
    id: 'gemini-2-5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Mới, mạnh mẽ hơn',
    badge: { label: 'Mặc định', tone: 'success' },
  },
  {
    id: 'gemini-3-flash',
    name: 'Gemini 3 Flash',
    description: 'Nhanh và hiệu quả',
  },
  {
    id: 'gemini-2-5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    description: 'Ổn định và đáng tin cậy',
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Mạnh mẽ, chi tiết, chính xác cao',
    badge: { label: 'Trả phí', tone: 'warning' },
  },
];

const acceptedFileExtensions = ['pdf', 'docx'];
const assessmentStages = [
  {
    threshold: 24,
    title: 'Đang tiếp nhận và chuẩn hóa dữ liệu đầu vào.',
    detail: 'Hệ thống đang đọc cấu trúc tài liệu, bóc tách nội dung và nhận diện bố cục SKKN.',
  },
  {
    threshold: 49,
    title: 'Đang đối chiếu với cơ sở dữ liệu và kiểm tra trùng lặp.',
    detail: 'Hệ thống đang so khớp nguồn nội bộ, internet và các kho tư liệu giáo dục.',
  },
  {
    threshold: 74,
    title: 'Đang rà soát lỗi ngữ pháp, chính tả và tính logic.',
    detail: 'AI đang kiểm tra diễn đạt, luận điểm, minh chứng và độ mạch lạc của nội dung.',
  },
  {
    threshold: 94,
    title: 'Đang tính điểm các tiêu chí thẩm định.',
    detail: 'Hệ thống đang chấm các nhóm tính mới, khả thi, khoa học và hình thức.',
  },
  {
    threshold: 100,
    title: 'Đang tổng hợp điểm số và hoàn thiện báo cáo.',
    detail: 'Chuẩn bị hiển thị bảng kết quả thẩm định chi tiết cho SKKN của bạn.',
  },
] as const;

function isAllowedUpload(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return Boolean(extension && acceptedFileExtensions.includes(extension));
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function maskApiKey(value: string) {
  if (!value) {
    return 'Chưa có API key';
  }

  if (value.length <= 8) {
    return '•'.repeat(value.length);
  }

  return `${value.slice(0, 4)}${'•'.repeat(Math.max(12, value.length - 8))}${value.slice(-4)}`;
}

function getAssessmentStage(progress: number) {
  return assessmentStages.find((stage) => progress <= stage.threshold) ?? assessmentStages[assessmentStages.length - 1];
}

function GuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) {
    return null;
  }

  return (
    <div className="guide-overlay" role="presentation" onClick={onClose}>
      <section
        className="guide-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="guide-modal-head">
          <div className="guide-modal-brand">
            <div className="guide-brand-mark">
              <Icon name="book" />
            </div>
            <div>
              <h2 id="guide-modal-title">Hướng dẫn sử dụng</h2>
              <p>Trợ lý Việt Hùng v1.4</p>
            </div>
          </div>

          <button type="button" className="guide-close" onClick={onClose} aria-label="Đóng hướng dẫn">
            ×
          </button>
        </div>

        <div className="guide-modal-body">
          <article className="guide-card">
            <span className="guide-step-badge step-blue">1</span>
            <div className="guide-card-content">
              <h3>Nhập thông tin SKKN</h3>
              <ul>
                <li>
                  Điền <strong>Tên đề tài</strong> và chọn <strong>Lĩnh vực</strong>
                </li>
                <li>
                  Nhập nội dung SKKN hoặc tải file <strong>Word/PDF</strong>
                </li>
                <li>
                  Sau đó bấm <strong>&quot;Phân tích SKKN&quot;</strong>
                </li>
              </ul>
            </div>
          </article>

          <article className="guide-card">
            <span className="guide-step-badge step-green">2</span>
            <div className="guide-card-content">
              <h3>Đọc kết quả phân tích</h3>

              <div className="guide-block">
                <p className="guide-block-title">Điểm số tổng quan (100 điểm):</p>
                <ul className="guide-detail-list">
                  <li>
                    <strong>Tính mới (30đ):</strong> Sáng tạo, độc đáo của giải pháp
                  </li>
                  <li>
                    <strong>Khả thi (40đ):</strong> Khả năng áp dụng thực tế
                  </li>
                  <li>
                    <strong>Khoa học (20đ):</strong> Cơ sở lý luận, số liệu minh chứng
                  </li>
                  <li>
                    <strong>Hình thức (10đ):</strong> Trình bày, chính tả, ngữ pháp
                  </li>
                </ul>
              </div>

              <div className="guide-block">
                <p className="guide-block-title">Nguy cơ đạo văn:</p>
                <ul className="guide-detail-list">
                  <li>
                    <strong className="guide-accent guide-accent-good">Thấp:</strong> Nội dung sáng tạo, ít trùng lặp
                  </li>
                  <li>
                    <strong className="guide-accent guide-accent-warn">Trung bình:</strong> Có một số đoạn cần viết lại
                  </li>
                  <li>
                    <strong className="guide-accent guide-accent-danger">Cao/Rất cao:</strong> Cần viết lại nhiều đoạn
                  </li>
                </ul>
              </div>

              <div className="guide-block">
                <p className="guide-block-title">Các mục phân tích:</p>
                <ul className="guide-detail-list">
                  <li>
                    <strong>Lỗi chính tả:</strong> Danh sách lỗi cần sửa
                  </li>
                  <li>
                    <strong>Đoạn nghi đạo văn:</strong> Các đoạn giống nguồn khác
                  </li>
                  <li>
                    <strong>Kế hoạch phát triển:</strong> Gợi ý cải thiện SKKN
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article className="guide-card">
            <span className="guide-step-badge step-purple">3</span>
            <div className="guide-card-content">
              <h3>Tự động sửa SKKN</h3>
              <ul>
                <li>
                  Bấm <strong>&quot;Tự động Sửa SKKN&quot;</strong> để AI tự sửa lỗi
                </li>
                <li>
                  Xem preview với chữ đỏ = đã sửa
                </li>
                <li>
                  <strong>&quot;Xuất Word (Giữ gốc)&quot;</strong>: Giữ nguyên format, hình ảnh, công thức
                </li>
                <li>
                  <strong>&quot;Sao chép&quot;</strong>: Copy HTML để dán vào Word
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function ApiKeyModal({
  open,
  settings,
  onClose,
  onSave,
}: {
  open: boolean;
  settings: ApiSettings;
  onClose: () => void;
  onSave: (nextSettings: ApiSettings) => void;
}) {
  const [draftKey, setDraftKey] = useState(settings.apiKey);
  const [selectedModel, setSelectedModel] = useState(settings.model);
  const [showKey, setShowKey] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraftKey(settings.apiKey);
    setSelectedModel(settings.model || defaultApiModel);
    setShowKey(false);
    setSaveMessage('');
  }, [open, settings.apiKey, settings.model]);

  if (!open) {
    return null;
  }

  const normalizedKey = draftKey.trim();
  const hasApiKey = normalizedKey.length > 0;

  const handleSave = () => {
    if (!hasApiKey) {
      return;
    }

    onSave({
      apiKey: normalizedKey,
      model: selectedModel,
    });
    setSaveMessage('Đã lưu cấu hình API key trên trình duyệt này.');
  };

  return (
    <div className="api-overlay" role="presentation" onClick={onClose}>
      <section
        className="api-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="api-modal-head">
          <div className="api-modal-brand">
            <div className="api-brand-mark">
              <Icon name="key" />
            </div>
            <div>
              <h2 id="api-modal-title">Cài đặt API Key</h2>
              <p>{settings.apiKey ? 'Đã có API Key' : 'Chưa có API Key'}</p>
            </div>
          </div>

          <button type="button" className="guide-close" onClick={onClose} aria-label="Đóng cài đặt API">
            ×
          </button>
        </div>

        <div className="api-modal-body">
          <label className="api-field">
            <span>Google Gemini API Key</span>
            <div className="api-key-input-shell">
              <span className="api-key-input-icon">
                <Icon name="edit" />
              </span>
              <input
                value={draftKey}
                onChange={(event) => {
                  setDraftKey(event.target.value);
                  setSaveMessage('');
                }}
                placeholder="Nhập Key riêng"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </label>

          <div className="api-key-preview" aria-live="polite">
            <span className={!hasApiKey ? 'is-empty' : ''}>{showKey ? normalizedKey : maskApiKey(normalizedKey)}</span>
            <button type="button" onClick={() => setShowKey((current) => !current)} disabled={!hasApiKey}>
              {showKey ? 'Ẩn' : 'Hiện'}
            </button>
          </div>

          <section className="api-model-section">
            <p className="api-section-title">Chọn Model AI</p>
            <div className="api-model-list" role="radiogroup" aria-label="Chọn model Gemini">
              {apiModelOptions.map((option) => {
                const isSelected = selectedModel === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`api-model-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      setSelectedModel(option.id);
                      setSaveMessage('');
                    }}
                  >
                    <span className={`api-model-radio ${isSelected ? 'is-selected' : ''}`} aria-hidden="true">
                      {isSelected ? <Icon name="check" /> : null}
                    </span>
                    <span className="api-model-copy">
                      <span className="api-model-headline">
                        <strong>{option.name}</strong>
                        {option.badge ? (
                          <span className={`api-model-badge badge-${option.badge.tone}`}>{option.badge.label}</span>
                        ) : null}
                      </span>
                      <span>{option.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="api-help-card">
            <p className="api-help-title">Hướng dẫn lấy API Key:</p>
            <div className="api-help-links">
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
                <Icon name="external" />
                Lấy API Key miễn phí tại Google AI Studio
              </a>
              <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noreferrer">
                <Icon name="external" />
                Xem hướng dẫn chi tiết
              </a>
            </div>
          </section>

          <div className="api-modal-footer">
            <p className="api-save-note">{saveMessage || 'API key được lưu cục bộ trên trình duyệt của bạn.'}</p>
            <button type="button" className="api-save-button" onClick={handleSave} disabled={!hasApiKey}>
              Lưu cấu hình
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function AssessmentScreen({
  progress,
  fileName,
}: {
  progress: number;
  fileName?: string;
}) {
  const normalizedProgress = Math.round(progress);
  const stage = getAssessmentStage(normalizedProgress);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dash = (normalizedProgress / 100) * circumference;

  return (
    <section className="assessment-shell" aria-live="polite">
      <div className="assessment-content">
        <div className="assessment-ring">
          <svg viewBox="0 0 120 120" className="assessment-ring-chart" aria-hidden="true">
            <circle cx="60" cy="60" r={radius} className="assessment-ring-track" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="assessment-ring-progress"
              style={{ strokeDasharray: `${dash} ${circumference}` }}
            />
          </svg>
          <strong>{normalizedProgress}%</strong>
        </div>

        <div className="assessment-copy">
          <h2>Đang thẩm định SKKN...</h2>
          <p>{stage.title}</p>
          {fileName ? <span className="assessment-file">Tài liệu đang xử lý: {fileName}</span> : null}
        </div>

        <div className="assessment-progress-panel">
          <div className="assessment-progress-head">
            <strong>Tiến độ phân tích</strong>
            <span>{normalizedProgress}%</span>
          </div>
          <div className="assessment-progress-track">
            <div className="assessment-progress-fill" style={{ width: `${normalizedProgress}%` }} />
          </div>
          <p className="assessment-progress-note">{stage.detail}</p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [contentMode, setContentMode] = useState<'upload' | 'text'>('upload');
  const [activeModal, setActiveModal] = useState<'guide' | 'api' | null>(null);
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    apiKey: '',
    model: defaultApiModel,
  });
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentProgress, setAssessmentProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resultsHeroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const savedSettings = window.localStorage.getItem(API_STORAGE_KEY);

      if (!savedSettings) {
        return;
      }

      const parsedSettings = JSON.parse(savedSettings) as Partial<ApiSettings>;
      const nextModel = apiModelOptions.some((option) => option.id === parsedSettings.model)
        ? parsedSettings.model!
        : defaultApiModel;

      setApiSettings({
        apiKey: typeof parsedSettings.apiKey === 'string' ? parsedSettings.apiKey : '',
        model: nextModel,
      });
    } catch {
      setApiSettings({
        apiKey: '',
        model: defaultApiModel,
      });
    }
  }, []);

  useEffect(() => {
    if (!activeModal) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveModal(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  useEffect(() => {
    if (!isAssessing) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setAssessmentProgress((current) => {
        if (current >= 100) {
          return 100;
        }

        const step = current < 24 ? 4 : current < 48 ? 3 : current < 74 ? 2 : current < 94 ? 1 : 1;
        return Math.min(100, current + step);
      });
    }, 170);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAssessing]);

  useEffect(() => {
    if (!isAssessing || assessmentProgress < 100) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsAssessing(false);
      window.requestAnimationFrame(() => {
        resultsHeroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, 700);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [assessmentProgress, isAssessing]);

  const handleSaveApiSettings = (nextSettings: ApiSettings) => {
    setApiSettings(nextSettings);

    try {
      window.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(nextSettings));
    } catch {
      // Ignore storage errors in demo mode.
    }
  };

  const handleFileSelection = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!isAllowedUpload(file)) {
      setUploadError('Chỉ hỗ trợ file PDF hoặc Word (.docx).');
      return;
    }

    setUploadedFile(file);
    setUploadError('');
  };

  const handleStartAssessment = () => {
    if (contentMode === 'upload' && !uploadedFile) {
      setUploadError('Vui lòng chọn file PDF hoặc Word (.docx) trước khi thẩm định.');
      return;
    }

    setActiveModal(null);
    setAssessmentProgress(0);
    setIsAssessing(true);
  };

  return (
    <div className="dashboard">
      <div className="background-orb orb-a" />
      <div className="background-orb orb-b" />
      <div className="background-grid" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Icon name="shield" />
          </div>
          <div>
            <strong>Trợ lý Việt Hùng</strong>
            <span>Trợ lý thẩm định SKKN</span>
          </div>
        </div>

        <div className="topbar-center">
          <span className="save-indicator">
            <Icon name="clock" />
            Đã lưu 21:13:25
          </span>
        </div>

        <nav className="topnav" aria-label="Điều hướng chính">
          {navItems.map((item) =>
            item.icon === 'book' || item.icon === 'key' ? (
              <button
                key={item.label}
                type="button"
                className="topnav-button"
                onClick={() => setActiveModal(item.icon === 'book' ? 'guide' : 'api')}
              >
                <Icon name={item.icon} />
                {item.label}
              </button>
            ) : (
              <a key={item.label} href="/" onClick={(event) => event.preventDefault()}>
                <Icon name={item.icon} />
                {item.label}
              </a>
            ),
          )}
          <span className="version-pill">v1.4</span>
          <a href="/" className="logout-link" onClick={(event) => event.preventDefault()}>
            <Icon name="logout" />
            Đăng xuất
          </a>
        </nav>
      </header>

      <main className="page-shell">
        {isAssessing ? (
          <AssessmentScreen
            progress={assessmentProgress}
            fileName={contentMode === 'upload' ? uploadedFile?.name : undefined}
          />
        ) : (
          <>
        <section className="panel input-panel">
          <div className="panel-head hero-head">
            <div>
              <p className="panel-kicker">Nhập thông tin SKKN</p>
              <h1>Giao diện thẩm định hiện đại cho giáo viên và hội đồng chấm</h1>
            </div>
            <p className="hero-copy">
              Bố cục này mô phỏng đúng tinh thần trang bạn gửi: nhập đề tài, tải nội dung, phân tích,
              rồi xem báo cáo tổng điểm và các khuyến nghị sửa ngay trên cùng một dashboard.
            </p>
          </div>

          <div className="input-grid">
            <label className="field field-title">
              <span>Tên đề tài SKKN</span>
              <div className="input-shell">
                <input defaultValue="Một số biện pháp giúp học sinh lớp 8 chủ động khi học Ngữ văn bằng công cụ số" />
                <button type="button" className="field-button">
                  <Icon name="search" />
                  Phân tích đề tài
                </button>
              </div>
            </label>

            <label className="field">
              <span>Cấp học</span>
              <select defaultValue="THCS">
                <option>Tiểu học</option>
                <option>THCS</option>
                <option>THPT</option>
              </select>
            </label>

            <label className="field">
              <span>Môn học / Lĩnh vực</span>
              <input defaultValue="Ngữ văn, chuyển đổi số, quản lý lớp học" />
            </label>

            <label className="field field-full">
              <span>Mục tiêu thi đạt giải</span>
              <select defaultValue="Cấp Trường">
                <option>Cấp Trường</option>
                <option>Cấp Xã/Phường</option>
                <option>Cấp Tỉnh/Thành phố</option>
              </select>
            </label>

            <div className="field field-full">
              <div className="field-row">
                <span>Nội dung SKKN</span>
                <a href="/" onClick={(event) => event.preventDefault()}>
                  Dùng dữ liệu mẫu
                </a>
              </div>

              <div className="content-switcher">
                <button
                  type="button"
                  className={contentMode === 'upload' ? 'is-active' : ''}
                  onClick={() => setContentMode('upload')}
                >
                  <Icon name="upload" />
                  Tải file lên
                </button>
                <button
                  type="button"
                  className={contentMode === 'text' ? 'is-active' : ''}
                  onClick={() => setContentMode('text')}
                >
                  <Icon name="document" />
                  Nhập văn bản
                </button>
              </div>

              {contentMode === 'upload' ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="file-input-hidden"
                    onChange={(event) => {
                      handleFileSelection(event.target.files?.[0] ?? null);
                      event.target.value = '';
                    }}
                  />

                  <div
                    className={`dropzone ${isDragActive ? 'is-dragging' : ''} ${uploadedFile ? 'has-file' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragActive(true);
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault();
                      if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        return;
                      }

                      setIsDragActive(false);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      setIsDragActive(false);
                      handleFileSelection(event.dataTransfer.files?.[0] ?? null);
                    }}
                  >
                    <div className="drop-icon">
                      <Icon name="upload" />
                    </div>

                    {uploadedFile ? (
                      <div className="uploaded-file-card">
                        <strong>{uploadedFile.name}</strong>
                        <p>
                          {formatFileSize(uploadedFile.size)} · Cập nhật lúc{' '}
                          {new Date(uploadedFile.lastModified).toLocaleDateString('vi-VN')}
                        </p>
                        <div className="uploaded-file-actions">
                          <button
                            type="button"
                            className="uploaded-file-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            Chọn file khác
                          </button>
                          <button
                            type="button"
                            className="uploaded-file-button is-ghost"
                            onClick={(event) => {
                              event.stopPropagation();
                              setUploadedFile(null);
                              setUploadError('');
                            }}
                          >
                            Bỏ file
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <strong>Kéo thả file hoặc click để chọn</strong>
                        <p>Hỗ trợ file `.pdf` và `.docx`</p>
                      </>
                    )}

                    <div className="file-badges">
                      <span>Word (.docx)</span>
                      <span>PDF</span>
                    </div>
                  </div>

                  {uploadError ? <p className="upload-error">{uploadError}</p> : null}
                </>
              ) : (
                <textarea
                  className="text-input"
                  defaultValue="Trong năm học 2025-2026, tôi triển khai giải pháp tăng mức độ chủ động của học sinh bằng mô hình giao nhiệm vụ đa tầng trên Canva, Padlet và Google Form. Sau 8 tuần, tỉ lệ học sinh hoàn thành nhiệm vụ đúng hạn tăng từ 57,8% lên 86,4%..."
                />
              )}
            </div>
          </div>

          <div className="input-footer">
            <button className="primary-cta" type="button" onClick={handleStartAssessment}>
              <Icon name="spark" />
              Kiểm tra ngay
            </button>
          </div>
        </section>

        <section ref={resultsHeroRef} className="panel result-hero">
          <div className="result-hero-head">
            <div>
              <p className="panel-kicker">Kết quả Thẩm định SKKN</p>
              <h2>Bảng điểm trực quan, đọc nhanh trong một màn hình</h2>
            </div>
            <div className="score-hero">
              <span>Tổng điểm dự kiến</span>
              <strong>80/100</strong>
            </div>
          </div>

          <div className="quick-actions">
            {quickActions.map((action) => (
              <QuickActionButton key={action.label} action={action} />
            ))}
          </div>
        </section>

        <section className="results-section">
          <div className="section-title">
            <p className="panel-kicker">Kết quả Phân tích</p>
            <h2>AI đã đánh giá chi tiết SKKN của bạn</h2>
          </div>

          <div className="stats-grid">
            {statCards.map((card) => (
              <RingCard key={card.title} card={card} />
            ))}

            <article className="panel structure-card">
              <p className="panel-kicker">Cấu trúc SKKN</p>
              <ul>
                {['Đặt vấn đề', 'Cơ sở lý luận', 'Thực trạng', 'Giải pháp', 'Kết quả', 'Kết luận'].map(
                  (item) => (
                    <li key={item}>
                      <span>{item}</span>
                      <span className="success-dot">
                        <Icon name="check" />
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </article>
          </div>

          <div className="chart-grid">
            <RadarChart />
            <BarChart />
          </div>

          <div className="detail-layout">
            <section className="panel criteria-panel">
              <div className="section-heading">
                <h3>Đánh giá chi tiết từng tiêu chí</h3>
                <p>Các thẻ màu vàng là nhóm tiêu chí cần ưu tiên chỉnh trước khi xuất báo cáo.</p>
              </div>

              <div className="criteria-list">
                {criteria.map((criterion) => (
                  <article
                    key={criterion.label}
                    className={`criterion-row ${criterion.score >= 8 ? 'is-strong' : 'is-warn'}`}
                  >
                    <div className="criterion-score">{criterion.score}</div>
                    <div className="criterion-meta">
                      <strong>{criterion.label}</strong>
                      <p>{criterion.note}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel source-panel">
              <div className="section-heading">
                <h3>Kiểm tra đạo văn</h3>
                <p>Nguồn đối chiếu được chia theo database nội bộ, internet và các website giáo dục.</p>
              </div>

              <div className="source-grid">
                {sourceChecks.map((source) => (
                  <article key={source.title} className={`source-card ${toneClassMap[source.tone]}`}>
                    <strong>{source.title}</strong>
                    <span>{source.detail}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel gauge-panel">
              <div className="section-heading">
                <h3>Biểu đồ điểm số</h3>
                <p>Tổng hợp theo 4 cụm chấm lớn để nhìn ra đường nâng điểm nhanh nhất.</p>
              </div>

              <div className="group-rings">
                {scoreGroups.map((group) => (
                  <div key={group.label} className="group-row">
                    <div className="group-label">
                      <span className={`group-dot ${toneClassMap[group.tone]}`} />
                      <strong>{group.label}</strong>
                    </div>
                    <div className="group-track">
                      <div
                        className={`group-fill ${toneClassMap[group.tone]}`}
                        style={{ width: `${clampPercent(group.score, group.total)}%` }}
                      />
                    </div>
                    <span>
                      {group.score}/{group.total}
                    </span>
                  </div>
                ))}
              </div>

              <div className="risk-cards">
                <article className="mini-risk mini-risk-good">
                  <strong>Trùng lặp đề tài: Thấp</strong>
                  <p>
                    Đề tài có tính ứng dụng thực trong chuyển đổi số, không trùng với mẫu phổ biến quá rõ.
                  </p>
                </article>
                <article className="mini-risk mini-risk-good">
                  <strong>Nguy cơ đạo văn: Thấp</strong>
                  <p>Phát hiện 1 đoạn văn bản có nguy cơ cao, còn lại đang ở vùng an toàn.</p>
                </article>
                <article className="mini-risk mini-risk-warn">
                  <strong>Đoạn văn cần xem xét</strong>
                  <p>
                    Cụm lý giải về EdTech gần nguồn tham khảo. Nên viết lại bằng ngôn ngữ riêng hoặc thêm trích
                    dẫn trực tiếp.
                  </p>
                </article>
              </div>
            </section>

            <section className="panel eval-panel">
              <div className="section-heading">
                <h3>Chi tiết đánh giá</h3>
                <p>Mỗi khối đều có điểm mạnh và điểm cần khắc phục để bạn sửa đúng chỗ.</p>
              </div>

              <div className="evaluation-list">
                {evaluationCards.map((item) => (
                  <article key={item.title} className="evaluation-card">
                    <h4>{item.title}</h4>
                    <div className="evaluation-columns">
                      <div className="evaluation-good">
                        <strong>Điểm mạnh</strong>
                        <p>{item.strengths}</p>
                      </div>
                      <div className="evaluation-warn">
                        <strong>Cần khắc phục</strong>
                        <p>{item.caution}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel issues-panel">
              <div className="section-heading">
                <h3>Lỗi Chính tả &amp; Diễn đạt (4)</h3>
                <p>Danh sách lỗi nhỏ nhưng rất đáng sửa vì kéo điểm hình thức và ngôn ngữ xuống.</p>
              </div>

              <div className="issues-list">
                {languageIssues.map((issue) => (
                  <article key={`${issue.type}-${issue.page}`} className="issue-row">
                    <span className="issue-tag">{issue.type}</span>
                    <div>
                      <strong>{issue.page}</strong>
                      <p>Suggestion: “{issue.suggestion}”</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel plan-panel">
              <div className="section-heading">
                <h3>Kế hoạch nâng cấp SKKN</h3>
                <p>Chia làm 3 lớp hành động để bạn biết việc gì nên sửa trước, việc gì để đầu tư sau.</p>
              </div>

              <div className="plan-grid">
                {upgradePlan.map((phase) => (
                  <article key={phase.label} className="plan-column">
                    <span className="plan-label">{phase.label}</span>
                    <h4>{phase.title}</h4>
                    <ul>
                      {phase.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <div className="expert-note">
                <strong>Lời khuyên chuyên gia</strong>
                <p>
                  “Sáng kiến đã có chất lượng tốt, đạt mức Giỏi. Để vượt mốc 90 điểm, cần bổ sung minh chứng
                  thực tế, số liệu khảo sát có đối chứng và làm phần tính mới sắc hơn ở ngay phần mở đầu.”
                </p>
              </div>
            </section>
          </div>

          <div className="bottom-cta">
            <button type="button" className="secondary-cta">
              <Icon name="search" />
              Kiểm tra SKKN khác
            </button>
          </div>
        </section>

          </>
        )}

        <footer className="footer-banner panel">
          <p>Đăng ký khóa học thực chiến viết SKKN, tạo app dạy học, tạo mô phỏng trực quan</p>
          <strong>Chỉ với 1 câu lệnh</strong>
          <button type="button" className="footer-button">
            Đăng ký ngay
          </button>
          <small>
            Mọi thông tin vui lòng liên hệ: Facebook <span>tranhoaithanhvicko</span> · Zalo <span>0348296773</span>
          </small>

          <div className="footer-promo-card">
            <p className="footer-promo-title">ĐĂNG KÝ KHÓA HỌC THỰC CHIẾN VIẾT SKKN, TẠO APP DẠY HỌC, TẠO MÔ PHỎNG TRỰC QUAN</p>
            <strong className="footer-promo-accent">CHỈ VỚI 1 CÂU LỆNH</strong>
            <button type="button" className="footer-button footer-button-large">
              ĐĂNG KÝ NGAY
            </button>
          </div>

          <div className="footer-contact">
            <p>Mọi thông tin vui lòng liên hệ:</p>
            <small className="footer-contact-links">
              <strong>Facebook:</strong>{' '}
              <a href="https://fb.com/viethungnvmt" target="_blank" rel="noreferrer">
                fb.com/viethungnvmt
              </a>
              <span className="footer-contact-divider">•</span>
              <strong>Zalo:</strong> <span>036.38.31.337</span>
            </small>
          </div>
        </footer>
      </main>

      <GuideModal open={activeModal === 'guide'} onClose={() => setActiveModal(null)} />
      <ApiKeyModal
        open={activeModal === 'api'}
        settings={apiSettings}
        onClose={() => setActiveModal(null)}
        onSave={handleSaveApiSettings}
      />
    </div>
  );
}
