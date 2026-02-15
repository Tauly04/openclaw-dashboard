/**
 * Feature Tree Architecture
 * 
 * 功能树架构设计
 * 
 * 核心概念：
 * - Feature: 功能模块，可独立运行
 * - Category: 功能分类，用于组织
 * - Tree: 功能树，层级结构
 * 
 * 数据结构：
 * {
 *   id: string,           // 唯一标识
 *   name: string,         // 显示名称
 *   key: string,          // 程序标识
 *   category: string,     // 所属分类
 *   icon: string,         // 图标 SVG path
 *   description: string,  // 描述
 *   status: 'active' | 'beta' | 'dev' | 'disabled',
 *   order: number,        // 排序权重
 *   route: string,        // 路由路径
 *   component: string,    // 组件名称
 *   permissions: string[], // 所需权限
 *   config: object,       // 模块配置
 *   children: Feature[]   // 子功能
 * }
 */

// 功能分类定义
export const FEATURE_CATEGORIES = {
  DASHBOARD: { key: 'dashboard', name: '仪表盘', icon: 'LayoutDashboard' },
  AGENT: { key: 'agent', name: 'Agent管理', icon: 'Bot' },
  SYSTEM: { key: 'system', name: '系统监控', icon: 'Monitor' },
  TOOLS: { key: 'tools', name: '工具箱', icon: 'Wrench' },
  AUTOMATION: { key: 'automation', name: '自动化', icon: 'Zap' },
  SETTINGS: { key: 'settings', name: '设置', icon: 'Settings' }
}

// 功能状态
export const FEATURE_STATUS = {
  ACTIVE: 'active',     // 已上线
  BETA: 'beta',         // 测试中
  DEV: 'dev',           // 开发中
  DISABLED: 'disabled'  // 已禁用
}

// 默认功能树
export const DEFAULT_FEATURE_TREE = [
  {
    id: 'root-dashboard',
    key: 'dashboard',
    name: '主控制台',
    category: 'dashboard',
    icon: 'LayoutDashboard',
    description: '系统概览和快捷操作',
    status: 'active',
    order: 1,
    route: '/',
    component: 'DashboardHome',
    permissions: ['user'],
    config: {},
    children: [
      {
        id: 'dashboard-status',
        key: 'status',
        name: '系统状态',
        category: 'dashboard',
        icon: 'Activity',
        description: '实时系统监控',
        status: 'active',
        order: 1,
        route: '/status',
        component: 'SystemStatus',
        permissions: ['user']
      },
      {
        id: 'dashboard-tasks',
        key: 'tasks',
        name: '任务管理',
        category: 'dashboard',
        icon: 'CheckSquare',
        description: '查看和管理任务',
        status: 'active',
        order: 2,
        route: '/tasks',
        component: 'TaskManager',
        permissions: ['user']
      }
    ]
  },
  {
    id: 'root-agent',
    key: 'agent',
    name: 'Agent中心',
    category: 'agent',
    icon: 'Bot',
    description: 'Agent管理和控制',
    status: 'active',
    order: 2,
    route: '/agent',
    component: 'AgentCenter',
    permissions: ['user'],
    children: [
      {
        id: 'agent-list',
        key: 'agent-list',
        name: 'Agent列表',
        category: 'agent',
        icon: 'List',
        description: '查看所有Agent',
        status: 'active',
        order: 1,
        route: '/agent/list',
        component: 'AgentList',
        permissions: ['user']
      },
      {
        id: 'agent-chat',
        key: 'chat',
        name: '对话中心',
        category: 'agent',
        icon: 'MessageCircle',
        description: '与Agent对话',
        status: 'active',
        order: 2,
        route: '/agent/chat',
        component: 'ChatCenter',
        permissions: ['user']
      }
    ]
  },
  {
    id: 'root-tools',
    key: 'tools',
    name: '工具箱',
    category: 'tools',
    icon: 'Wrench',
    description: '实用工具集合',
    status: 'active',
    order: 3,
    route: '/tools',
    component: 'ToolBox',
    permissions: ['user'],
    children: [
      {
        id: 'tools-terminal',
        key: 'terminal',
        name: '终端',
        category: 'tools',
        icon: 'Terminal',
        description: '命令行终端',
        status: 'beta',
        order: 1,
        route: '/tools/terminal',
        component: 'Terminal',
        permissions: ['user']
      },
      {
        id: 'tools-filemanager',
        key: 'files',
        name: '文件管理',
        category: 'tools',
        icon: 'Folder',
        description: '浏览和管理文件',
        status: 'dev',
        order: 2,
        route: '/tools/files',
        component: 'FileManager',
        permissions: ['admin']
      }
    ]
  },
  {
    id: 'root-automation',
    key: 'automation',
    name: '自动化',
    category: 'automation',
    icon: 'Zap',
    description: '自动化工作流',
    status: 'dev',
    order: 4,
    route: '/automation',
    component: 'Automation',
    permissions: ['user'],
    children: []
  },
  {
    id: 'root-settings',
    key: 'settings',
    name: '系统设置',
    category: 'settings',
    icon: 'Settings',
    description: '配置和个性化',
    status: 'active',
    order: 5,
    route: '/settings',
    component: 'Settings',
    permissions: ['user'],
    children: [
      {
        id: 'settings-general',
        key: 'general',
        name: '常规设置',
        category: 'settings',
        icon: 'Sliders',
        description: '基础配置',
        status: 'active',
        order: 1,
        route: '/settings/general',
        component: 'GeneralSettings',
        permissions: ['user']
      },
      {
        id: 'settings-features',
        key: 'feature-tree',
        name: '功能树管理',
        category: 'settings',
        icon: 'GitBranch',
        description: '管理功能模块',
        status: 'active',
        order: 2,
        route: '/settings/features',
        component: 'FeatureTreeManager',
        permissions: ['admin']
      }
    ]
  }
]
