export * from './color';
export * from './runtime';
export * from './generated';
export * from './crystal-displacement';

import Phaser from 'phaser';
import {
  FILTER_ADDERS as GENERATED_FILTER_ADDERS,
  FILTER_CONTROLLERS as GENERATED_FILTER_CONTROLLERS,
  FILTER_METADATA as GENERATED_FILTER_METADATA,
  FILTER_METADATA_BY_ID as GENERATED_FILTER_METADATA_BY_ID,
  FILTER_RENDER_NODES as GENERATED_FILTER_RENDER_NODES,
  getFilterMetadata as getGeneratedFilterMetadata,
} from './generated';
import { FilterMetadata } from './runtime';
import {
  CrystalDisplacementFilter,
  CrystalDisplacementFilterMetadata,
  PhaserCrystalDisplacementFilter,
  addCrystalDisplacementFilter,
} from './crystal-displacement';

export const FILTER_METADATA = ([
  ...GENERATED_FILTER_METADATA,
  CrystalDisplacementFilterMetadata,
] satisfies FilterMetadata[]).sort((a, b) => a.displayName.localeCompare(b.displayName));

export const FILTER_METADATA_BY_ID = {
  ...GENERATED_FILTER_METADATA_BY_ID,
  [CrystalDisplacementFilterMetadata.id]: CrystalDisplacementFilterMetadata,
} as Record<string, FilterMetadata>;

export const FILTER_RENDER_NODES = {
  ...GENERATED_FILTER_RENDER_NODES,
  PhaserCrystalDisplacementFilter,
};

export const FILTER_CONTROLLERS = {
  ...GENERATED_FILTER_CONTROLLERS,
  CrystalDisplacementFilter,
};

export const FILTER_ADDERS = {
  ...GENERATED_FILTER_ADDERS,
  CrystalDisplacementFilter: addCrystalDisplacementFilter,
};

export const registerPhaserFilters = (scene: Phaser.Scene): void => {
  const renderNodes = (scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).renderNodes;

  for (const [name, NodeConstructor] of Object.entries(FILTER_RENDER_NODES)) {
    if (!renderNodes.hasNode(name)) {
      renderNodes.addNodeConstructor(name, NodeConstructor);
    }
  }
};

export const getFilterMetadata = (id: string): FilterMetadata | undefined => (
  FILTER_METADATA_BY_ID[id] ?? getGeneratedFilterMetadata(id)
);
