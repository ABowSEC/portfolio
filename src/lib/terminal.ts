// Lets any component open the terminal without a shared React context.
export const TERMINAL_EVENT = "abowsec:open-terminal";

export function openTerminal() {
  window.dispatchEvent(new Event(TERMINAL_EVENT));
}
