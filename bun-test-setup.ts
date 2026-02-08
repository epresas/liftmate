import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Register the DOM environment for Bun.
GlobalRegistrator.register();

import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment.
try {
  const testBed = getTestBed();
  if (!testBed.platform) {
    testBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }
    );
  }
} catch (e) {
  // Already initialized or failed
}
