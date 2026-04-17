class UIState {
	docsTab = $state<'mission' | 'protocol'>('mission');
	docsOpen = $state(false);
}

export const uiState = new UIState();
