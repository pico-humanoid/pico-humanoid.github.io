export const site = {
  name: 'PICO-Humanoid',
  expansion: 'Predictive Intelligent COntrolled Humanoid Robot',
  description: 'PICO-Humanoid 是由 PI-Control Lab 自主研发的人形机器人研究平台。',
  url: 'https://pico-humanoid.github.io',
  github: 'https://github.com/PICO-Humanoid',
  lab: 'https://picontrollab.com/',
};

export type Resource = { label: string; href: string; description?: string };
export type ContentPage = {
  path: string;
  title: string;
  section: string;
  eyebrow: string;
  description: string;
  upcoming: string[];
  resources: Resource[];
};

export const pages: ContentPage[] = [
  {
    path: '/guides/', title: '使用指南', section: '使用指南', eyebrow: 'GETTING STARTED',
    description: '平台环境准备、操作流程与使用说明将在这里逐步整理。现有开发工具链与 MCP 接入指南可从下方访问。',
    upcoming: ['环境准备与快速开始', '平台操作与使用说明', '常见问题与故障排查'],
    resources: [
      { label: '开发工具链指南', href: 'https://github.com/PICO-Humanoid/.github/blob/main/docs/toolchain-guide.md', description: '软件与硬件开发工具的配置说明。' },
      { label: 'MCP 接入指南', href: 'https://github.com/PICO-Humanoid/.github/blob/main/docs/MCP-guide.md', description: '开发工具的 MCP 接入与使用资料。' },
    ],
  },
  {
    path: '/platform/mechanism/', title: '机械设计', section: '平台技术', eyebrow: 'PLATFORM / MECHANISM',
    description: '这里将介绍 PICO-Humanoid 的结构与机构设计，并提供相关设计资料。',
    upcoming: ['结构与机构概览', '设计资料与装配说明'],
    resources: [{ label: 'PICO-Mechanism', href: `${site.github}/pico-mechanism`, description: '机械设计仓库。' }],
  },
  {
    path: '/platform/electronics/', title: '电气设计', section: '平台技术', eyebrow: 'PLATFORM / ELECTRONICS',
    description: '这里将介绍 PICO-Humanoid 的电路设计与电子系统，并提供相关设计资料。',
    upcoming: ['电子系统概览', '电路设计与连接说明'],
    resources: [{ label: 'PICO-Electronics', href: `${site.github}/pico-electronics`, description: '电气设计仓库。' }],
  },
  {
    path: '/platform/firmware/', title: '固件设计', section: '平台技术', eyebrow: 'PLATFORM / FIRMWARE',
    description: '这里将介绍 PICO-Humanoid 的嵌入式固件，以及相关开发与使用方式。',
    upcoming: ['固件架构概览', '构建、烧录与调试说明'],
    resources: [{ label: 'PICO-Firmware', href: `${site.github}/pico-firmware`, description: '嵌入式固件仓库。' }],
  },
  {
    path: '/platform/software/', title: '软件设计', section: '平台技术', eyebrow: 'PLATFORM / SOFTWARE',
    description: '这里将介绍 PICO-Humanoid 的软件与控制系统，以及相关开发与使用资料。',
    upcoming: ['软件与控制系统概览', '开发与运行说明'],
    resources: [{ label: 'GitHub 组织', href: site.github, description: '软件资料持续整理中，独立仓库入口将在确认后补充。' }],
  },
  {
    path: '/research/publications/', title: '相关论文', section: '研究成果', eyebrow: 'RESEARCH / PUBLICATIONS',
    description: '这里将汇集与 PICO-Humanoid 相关的研究论文及其公开访问入口。',
    upcoming: ['论文目录', '论文链接与相关研究资料'],
    resources: [],
  },
  {
    path: '/about/team/', title: '开发/贡献团队', section: '关于我们', eyebrow: 'ABOUT / TEAM',
    description: 'PICO-Humanoid 由 PI-Control Lab 自主研发。开发与贡献团队信息将在这里逐步完善。',
    upcoming: ['开发团队介绍', '贡献者与参与方式'],
    resources: [
      { label: 'PI-Control Lab', href: site.lab, description: '了解实验室。' },
      { label: 'GitHub 组织', href: site.github, description: '了解项目仓库与贡献入口。' },
    ],
  },
];

type NavLink = { label: string; href: string; external?: boolean };
type NavGroup = { label: string; children: NavLink[] };
export type NavItem = NavLink | NavGroup;

export const navigation: NavItem[] = [
  { label: 'PICO简介', href: '/' },
  { label: '使用指南', href: '/guides/' },
  { label: '平台技术', children: pages.filter(p => p.section === '平台技术').map(p => ({ label: p.title, href: p.path })) },
  { label: '研究成果', children: [{ label: '相关论文', href: '/research/publications/' }] },
  { label: '关于我们', children: [{ label: 'PI-Control Lab', href: site.lab, external: true }, { label: '开发/贡献团队', href: '/about/team/' }] },
];

export const platform = [
  { title: '机械设计', description: '结构与机构设计', href: '/platform/mechanism/', icon: 'cog' },
  { title: '电气设计', description: '电路与电子系统', href: '/platform/electronics/', icon: 'circuit' },
  { title: '固件设计', description: '嵌入式固件', href: '/platform/firmware/', icon: 'cpu' },
  { title: '软件设计', description: '软件与控制系统', href: '/platform/software/', icon: 'code' },
] as const;
