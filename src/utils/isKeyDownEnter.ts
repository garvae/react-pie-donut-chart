import React from 'react';

/**
 * Defines is current event is fired by the "enter" key press or not
 * @function { (e: React.KeyboardEvent) => boolean } isKeyDownEnter
 * @param { React.KeyboardEvent } e - KeyboardEvent
 * @return { boolean } - is current event is fired by the "enter" key press
 */
export const isKeyDownEnter = (e: React.KeyboardEvent) =>
  e.code?.toLowerCase?.() === 'enter' ||
  (e.code && String(e.code) === '13') ||
  (e.key && String(e.key) === '13') ||
  e.key?.toLowerCase?.() === 'enter';
