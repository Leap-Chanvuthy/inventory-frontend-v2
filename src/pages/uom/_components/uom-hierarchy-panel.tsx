/**
 * UomHierarchyPanel — Right-hand panel of the UOM split-panel page.
 *
 * Fetches all UOMs for the selected category, builds a tree structure,
 * and renders them as a vertical chain of UomCard components connected
 * by arrow connectors.
 */
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUOMs, useTrashedUOMs } from "@/api/uom/uom.query";
import { UOM } from "@/api/uom/uom.types";
import { UomCard } from "./uom-card";
import { CreateUomModal } from "./create-uom-modal";
import { EditUomModal } from "./edit-uom-modal";
import { Button } from "@/components/ui/button";
import {
  BoxIcon,
  ArrowDownIcon,
  Plus,
  Loader2,
  Trash2,
  RotateCcw,
  ArchiveX,
  CirclePlus,
} from "lucide-react";

interface UomHierarchyPanelProps {
  categoryId: number;
  categoryName: string;
}

// ── Tree helpers ──────────────────────────────────────────────────────────────

interface TreeNode {
  uom: UOM;
  children: TreeNode[];
}

function buildTree(uoms: UOM[]): TreeNode[] {
  // Roots are the base unit(s) or units with no parent in this category
  const allIds = new Set(uoms.map(u => u.id));

  const roots = uoms.filter(u => {
    if (u.is_base_unit) return true;
    // No parent, or parent is outside this category list
    return !u.base_uom_id || !allIds.has(u.base_uom_id);
  });

  function getChildren(uom: UOM): TreeNode[] {
    return uoms
      .filter(u => u.base_uom_id === uom.id && u.id !== uom.id)
      .map(child => ({ uom: child, children: getChildren(child) }));
  }

  return roots.map(r => ({ uom: r, children: getChildren(r) }));
}

// ── Recursive node renderer ────────────────────────────────────────────────

interface TreeViewProps {
  nodes: TreeNode[];
  allUoms: UOM[];
  depth?: number;
  onAddChild: (parent: UOM) => void;
  onEdit?: (uom: UOM) => void;
  isTrash?: boolean;
}

function TreeView({ nodes, allUoms, depth = 0, onAddChild, onEdit, isTrash }: TreeViewProps) {
  return (
    <div className="w-full">
      {nodes.map((node, idx) => (
        <div key={node.uom.id}>
          {/* Connector to parent */}
          {idx > 0 && (
            <div className="flex items-center justify-center py-1">
              <ArrowDownIcon className="h-4 w-4 text-muted-foreground/40" />
            </div>
          )}

          <UomCard
            uom={node.uom}
            allCategoryUoms={allUoms}
            onAddChild={onAddChild}
            onEdit={onEdit}
            isTrash={isTrash}
          />

          {/* Children, indented */}
          {node.children.length > 0 && (
            <div className="mt-1 w-full">
              <div className="flex items-center justify-center py-1">
                <ArrowDownIcon className="h-4 w-4 text-muted-foreground/40" />
              </div>
              <TreeView
                nodes={node.children}
                allUoms={allUoms}
                depth={depth + 1}
                onAddChild={onAddChild}
                onEdit={onEdit}
                isTrash={isTrash}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onCreateBase }: { onCreateBase: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
      <div className="rounded-full bg-muted p-6">
        <BoxIcon className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">No units created yet</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-xs">
          Start by creating a base unit (e.g. "Tablet"). You can then add
          larger units like "Blister" or "Box" on top of it.
        </p>
      </div>
      <Button
        className="gap-2 bg-[#5c52d6] hover:bg-[#4c43c0] text-white"
        onClick={onCreateBase}
      >
        <Plus className="h-4 w-4" />
        Create Base Unit
      </Button>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function UomHierarchyPanel({ categoryId, categoryName }: UomHierarchyPanelProps) {
  const { data, isLoading } = useUOMs({
    "filter[category_id]": categoryId,
    per_page: 100,
  } as any);

  // tab=archived persisted in URL — survives page refresh
  const [searchParams, setSearchParams] = useSearchParams();
  const showTrashedUoms = searchParams.get("tab") === "archived";

  function toggleTrashedUoms() {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!showTrashedUoms) next.set("tab", "archived");
        else next.delete("tab");
        return next;
      },
      { replace: true }
    );
  }

  const { data: trashedData, isLoading: trashedLoading } = useTrashedUOMs(
    { "filter[category_id]": categoryId, per_page: 100 },
    showTrashedUoms
  );

  const activeUoms: UOM[] = (data as any)?.data ?? data ?? [];
  const trashedUoms: UOM[] = (trashedData as any)?.data ?? [];

  const allUoms: UOM[] = showTrashedUoms ? trashedUoms : activeUoms;

  // Create modal state: which parent to pre-fill (undefined = base unit creation)
  const [defaultParent, setDefaultParent] = useState<UOM | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  // Edit modal state
  const [editTarget, setEditTarget] = useState<UOM | null>(null);

  function openModalForBase() {
    setDefaultParent(undefined);
    setModalOpen(true);
  }

  function openModalForChild(parent: UOM) {
    setDefaultParent(parent);
    setModalOpen(true);
  }

  const tree = buildTree(allUoms);
  const unitCount = allUoms.length;
  const currentlyLoading = showTrashedUoms ? trashedLoading : isLoading;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0 flex items-center justify-between gap-4">
        <div className="min-w-0 pb-[22px]">
          <h2 className="font-semibold text-lg truncate">{categoryName}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {unitCount === 0
              ? showTrashedUoms ? "No archived units" : "No units"
              : `${unitCount} ${showTrashedUoms ? "archived" : ""} unit${unitCount !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Trash toggle */}
          <Button
            variant={showTrashedUoms ? "secondary" : "ghost"}
            size="sm"
            className={showTrashedUoms ? "gap-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200" : "gap-1.5 text-muted-foreground"}
            onClick={toggleTrashedUoms}
            title={showTrashedUoms ? "Hide archived units" : "Show archived units"}
          >
            {showTrashedUoms ? (
              <><RotateCcw className="h-3.5 w-3.5" /> Active</>
            ) : (
              <><Trash2 className="h-3.5 w-3.5" /> Archived</>
            )}
          </Button>

          {!showTrashedUoms && (
            <Button
              className="gap-2 bg-[#5c52d6] hover:bg-[#4c43c0] text-white"
              onClick={openModalForBase}
              disabled={currentlyLoading}
            >
              <CirclePlus className="h-4 w-4" />
              Add Unit
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {currentlyLoading ? (
          <div className="flex items-center justify-center h-48 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading units…</span>
          </div>
        ) : showTrashedUoms ? (
          unitCount === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 px-6 text-center">
              <ArchiveX className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No archived units for this category.</p>
            </div>
          ) : (
            <div className="p-4 sm:p-6 w-full space-y-3">
              {allUoms.map(uom => (
                <UomCard
                  key={uom.id}
                  uom={uom}
                  allCategoryUoms={allUoms}
                  onAddChild={() => {}}
                  isTrash
                />
              ))}
              {/* Note: onEdit intentionally omitted in trash view */}
            </div>
          )
        ) : unitCount === 0 ? (
          <EmptyState onCreateBase={openModalForBase} />
        ) : (
          <div className="p-4 sm:p-6 w-full">
            <TreeView
              nodes={tree}
              allUoms={allUoms}
              onAddChild={openModalForChild}
              onEdit={setEditTarget}
            />
          </div>
        )}
      </div>

      {/* Create modal */}
      {modalOpen && (
        <CreateUomModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          categoryUoms={allUoms}
          defaultParent={defaultParent}
          categoryId={categoryId}
        />
      )}

      {/* Edit modal */}
      {editTarget && (
        <EditUomModal
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          uom={editTarget}
          categoryUoms={activeUoms}
          categoryId={categoryId}
        />
      )}
    </div>
  );
}
