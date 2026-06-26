import React from 'react';

/**
 * Defines whether the current event was fired by a Space key press.
 *
 * Space activates interactive elements in the same way as Enter (WAI-ARIA
 * keyboard interaction patterns for button-role elements). It must be
 * accompanied by `e.preventDefault()` at the call site to prevent the default
 * browser scroll behaviour.
 *
 * @function isKeyDownSpace
 * @param { React.KeyboardEvent } e - KeyboardEvent
 * @return { boolean } - true if the Space key was pressed
 */
export const isKeyDownSpace = (e: React.KeyboardEvent) =>
  e.code?.toLowerCase?.() === 'space' || e.key === ' ' || e.key?.toLowerCase?.() === 'space';
