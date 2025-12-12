
import React, { createContext, useState, useContext } from 'react';

export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    appName: '智能润滑管理',
    nav: {
      dashboard: '概览仪表盘',
      schedule: '每日计划',
      inventory: '设备台账',
      stock: '油品库存',
      sop: '标准作业',
      history: '历史记录',
      assistant: '智能助手',
    },
    common: {
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      confirm: '确认',
      search: '搜索...',
      export: '导出',
      actions: '操作',
      date: '日期',
      user: '操作人',
      notes: '备注',
      status: '状态',
      loading: '加载中...',
      all: '全部',
      add: '添加',
      ok: '正常',
      due: '今日到期',
      overdue: '逾期',
      lowStock: '库存低',
      sufficient: '充足',
      in: '入库',
      out: '领用',
      unit: '单位',
      amount: '数量',
      type: '类型',
      name: '名称'
    },
    dashboard: {
      title: '运营概览仪表盘',
      totalEq: '设备总数',
      dueToday: '今日到期',
      severeOverdue: '严重逾期',
      tasks7d: '近7天任务数',
      stockMonitor: '润滑油库存监控',
      recentTx: '最近出入库记录',
      compliance: '合规性状态',
      trend: '润滑活动趋势 (近7天)',
      completedCount: '完成次数',
      stockWarning: '库存预警'
    },
    schedule: {
      title: '每日计划',
      subtitle: '今日任务清单与作业工单',
      export: '导出作业工单 (Excel)',
      allDone: '任务已全部完成！',
      noTasks: '今天没有待处理的润滑任务。',
      complete: '完成任务',
      modalTitle: '完成润滑任务',
      actualDate: '实际润滑日期',
      nextDate: '下次计划日期 (自动计算)',
      performer: '执行人',
      cycleHint: '周期: {days} 天 (若不修改则自动顺延)',
      status: '状态',
      eqInfo: '设备信息',
      location: '位置',
      req: '润滑要求',
      planDate: '计划截止',
      addPhoto: '添加照片',
      photoComment: '照片注释',
      compressing: '压缩中...'
    },
    inventory: {
      title: '设备台账',
      subtitle: '管理设备资产及润滑参数',
      add: '添加设备',
      name: '设备名称',
      location: '位置',
      lubricant: '润滑剂/量',
      cycle: '周期 (天)',
      capacity: '加注量/容量',
      lastLube: '上次润滑日期',
      modalTitle: '设备信息',
      editTitle: '编辑设备',
      addTitle: '添加新设备',
      notFound: '未找到匹配的设备。'
    },
    stock: {
      title: '油品库存管理',
      subtitle: '管理润滑油种类、库存调整及查询流转记录',
      add: '添加新油品',
      list: '库存列表',
      history: '领用与入库记录',
      export: '导出表格',
      modalItem: '油品信息',
      modalTx: '库存变动',
      threshold: '低库存预警值',
      warning: '库存预警',
      stockIn: '库存入库',
      stockOut: '领用登记',
      confirm: '确认',
      cancel: '取消',
      itemName: '油品名称',
      currentStock: '库存数量'
    },
    sop: {
      catTitle: '设备/作业分类',
      docList: 'SOP 文档列表',
      addCat: '添加新分类',
      addDoc: '新增 SOP 文档',
      noDocs: '该分类下暂无文档',
      selectCat: '请从左侧选择一个设备分类',
      docTitle: '文档标题',
      content: '内容 (支持 Markdown)',
      catName: '分类名称',
      desc: '描述',
      createFirst: '立即创建第一个文档',
      edit: '编辑',
      delete: '删除'
    },
    history: {
      title: '历史记录与时间线',
      subtitle: '查看设备维护档案及导出报表',
      timeline: '维护时间线',
      export: '导出报表(含图)',
      noRecords: '没有找到相关的历史记录。',
      filterEq: '显示所有设备',
      deleteConfirm: '确定要删除这条历史记录吗？此操作无法撤销。',
      viewPhotos: '查看照片',
      settings: '设置',
      retentionPolicy: '照片保留策略',
      retentionDesc: '自动删除超过以下天数的照片以节省空间 (0 = 永久保留)',
      days: '天',
      photosCleaned: '已自动清理过期照片'
    },
    ai: {
      title: '智能维护助手',
      subtitle: '由 Gemini 驱动。咨询润滑技术问题或分析您的设备群数据。',
      placeholder: '例如: "高温轴承用什么润滑脂最好？"',
      analyze: '分析我的维护日程风险',
      reply: '助手回复',
      error: '抱歉，连接智能服务时出现错误。',
      safety: '安全预防措施',
      viscosity: '粘度等级说明'
    }
  },
  en: {
    appName: 'LubeTrack Pro',
    nav: {
      dashboard: 'Dashboard',
      schedule: 'Schedule',
      inventory: 'Equipment',
      stock: 'Stock',
      sop: 'SOPs',
      history: 'History',
      assistant: 'AI Assistant',
    },
    common: {
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
      search: 'Search...',
      export: 'Export',
      actions: 'Actions',
      date: 'Date',
      user: 'User',
      notes: 'Notes',
      status: 'Status',
      loading: 'Loading...',
      all: 'All',
      add: 'Add',
      ok: 'OK',
      due: 'Due Today',
      overdue: 'Overdue',
      lowStock: 'Low Stock',
      sufficient: 'Sufficient',
      in: 'Stock In',
      out: 'Stock Out',
      unit: 'Unit',
      amount: 'Qty',
      type: 'Type',
      name: 'Name'
    },
    dashboard: {
      title: 'Operations Dashboard',
      totalEq: 'Total Assets',
      dueToday: 'Due Today',
      severeOverdue: 'Overdue',
      tasks7d: '7-Day Tasks',
      stockMonitor: 'Lubricant Inventory',
      recentTx: 'Recent Transactions',
      compliance: 'Compliance Status',
      trend: 'Activity Trend (7d)',
      completedCount: 'Completed',
      stockWarning: 'Low Stock'
    },
    schedule: {
      title: 'Daily Schedule',
      subtitle: 'Task List & Work Orders',
      export: 'Export Work Orders',
      allDone: 'All Tasks Completed!',
      noTasks: 'No pending tasks for today.',
      complete: 'Complete',
      modalTitle: 'Complete Task',
      actualDate: 'Date Performed',
      nextDate: 'Next Due Date (Auto)',
      performer: 'Performer',
      cycleHint: 'Cycle: {days} days (Auto-extends)',
      status: 'Status',
      eqInfo: 'Equipment',
      location: 'Location',
      req: 'Requirements',
      planDate: 'Due Date',
      addPhoto: 'Add Photo',
      photoComment: 'Photo Comment',
      compressing: 'Compressing...'
    },
    inventory: {
      title: 'Equipment Ledger',
      subtitle: 'Manage assets and lubrication specs',
      add: 'Add Equipment',
      name: 'Equipment Name',
      location: 'Location',
      lubricant: 'Lubricant',
      cycle: 'Cycle (Days)',
      capacity: 'Capacity',
      lastLube: 'Last Lube Date',
      modalTitle: 'Equipment Details',
      editTitle: 'Edit Equipment',
      addTitle: 'Add New Equipment',
      notFound: 'No matching equipment found.'
    },
    stock: {
      title: 'Stock Management',
      subtitle: 'Manage lubricants and track usage',
      add: 'Add Item',
      list: 'Inventory List',
      history: 'Transaction History',
      export: 'Export CSV',
      modalItem: 'Item Details',
      modalTx: 'Stock Adjustment',
      threshold: 'Min Threshold',
      warning: 'Low Stock',
      stockIn: 'Stock In',
      stockOut: 'Stock Out',
      confirm: 'Confirm',
      cancel: 'Cancel',
      itemName: 'Item Name',
      currentStock: 'Current Stock'
    },
    sop: {
      catTitle: 'Categories',
      docList: 'SOP Documents',
      addCat: 'Add Category',
      addDoc: 'Add Document',
      noDocs: 'No documents in this category',
      selectCat: 'Select a category from the left',
      docTitle: 'Document Title',
      content: 'Content (Markdown)',
      catName: 'Category Name',
      desc: 'Description',
      createFirst: 'Create first document',
      edit: 'Edit',
      delete: 'Delete'
    },
    history: {
      title: 'History & Timeline',
      subtitle: 'Maintenance archives and reports',
      timeline: 'Maintenance Timeline',
      export: 'Export Report (w/ Photos)',
      noRecords: 'No history records found.',
      filterEq: 'All Equipment',
      deleteConfirm: 'Are you sure you want to delete this record? Irreversible.',
      viewPhotos: 'View Photos',
      settings: 'Settings',
      retentionPolicy: 'Photo Retention Policy',
      retentionDesc: 'Auto-delete photos older than days (0 = keep forever)',
      days: 'Days',
      photosCleaned: 'Auto-cleaned old photos'
    },
    ai: {
      title: 'AI Assistant',
      subtitle: 'Powered by Gemini. Ask tech questions or analyze data.',
      placeholder: 'e.g., "Best grease for high temp?"',
      analyze: 'Analyze Risk',
      reply: 'AI Reply',
      error: 'Sorry, error connecting to AI service.',
      safety: 'Safety Precautions',
      viscosity: 'Viscosity Explained'
    }
  }
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['zh'];
}>({
  language: 'zh',
  setLanguage: () => {},
  t: translations['zh'],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
