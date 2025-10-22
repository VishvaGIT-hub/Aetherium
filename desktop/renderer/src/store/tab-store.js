import { create } from 'zustand';

export const useTabStore = create((set, get) => ({
  tabs: [],
  activeTabId: null,

  initializeTabs: async () => {
    // Create initial tab
    const tab = await window.aetherium.tabs.create('aetherium://newtab');
    set({ tabs: [tab], activeTabId: tab.id });
  },

  createTab: async (url = 'aetherium://newtab') => {
    const tab = await window.aetherium.tabs.create(url);
    set(state => ({
      tabs: [...state.tabs, tab],
      activeTabId: tab.id
    }));
    return tab;
  },

  closeTab: async (tabId) => {
    const { tabs, activeTabId } = get();
    
    if (tabs.length === 1) {
      // Don't close last tab, create new one instead
      get().createTab();
      return;
    }

    await window.aetherium.tabs.close(tabId);
    
    const newTabs = tabs.filter(t => t.id !== tabId);
    let newActiveTabId = activeTabId;

    if (tabId === activeTabId) {
      const closedIndex = tabs.findIndex(t => t.id === tabId);
      newActiveTabId = newTabs[Math.max(0, closedIndex - 1)]?.id;
    }

    set({
      tabs: newTabs,
      activeTabId: newActiveTabId
    });
  },

  activateTab: async (tabId) => {
    await window.aetherium.tabs.activate(tabId);
    set({ activeTabId: tabId });
  },

  updateTab: async (tabId, data) => {
    const updatedTab = await window.aetherium.tabs.update(tabId, data);
    set(state => ({
      tabs: state.tabs.map(t => t.id === tabId ? { ...t, ...data } : t)
    }));
  },

  getActiveTab: () => {
    const { tabs, activeTabId } = get();
    return tabs.find(t => t.id === activeTabId);
  }
}));
