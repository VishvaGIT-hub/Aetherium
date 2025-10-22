import { create } from 'zustand';

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  activeWorkspaceId: null,

  loadWorkspaces: async () => {
    const workspaces = await window.aetherium.workspaces.getAll();
    const active = workspaces.find(w => w.active);
    set({ 
      workspaces,
      activeWorkspaceId: active?.id || workspaces[0]?.id
    });
  },

  createWorkspace: async (name) => {
    const workspace = await window.aetherium.workspaces.create(name);
    set(state => ({
      workspaces: [...state.workspaces, workspace]
    }));
    return workspace;
  },

  switchWorkspace: async (id) => {
    const workspace = await window.aetherium.workspaces.switch(id);
    set({ activeWorkspaceId: id });
    return workspace;
  },

  deleteWorkspace: async (id) => {
    await window.aetherium.workspaces.delete(id);
    set(state => ({
      workspaces: state.workspaces.filter(w => w.id !== id)
    }));
  },

  getActiveWorkspace: () => {
    const { workspaces, activeWorkspaceId } = get();
    return workspaces.find(w => w.id === activeWorkspaceId);
  }
}));
