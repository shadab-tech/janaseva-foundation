import { FC, ReactNode, useState, useCallback, useEffect } from 'react';

interface TreeNode {
  id: string | number;
  label: string;
  icon?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  expanded?: boolean;
  selected?: boolean;
  metadata?: Record<string, unknown>;
}

interface TreeProps {
  nodes: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  onExpand?: (node: TreeNode, expanded: boolean) => void;
  className?: string;
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  defaultExpandAll?: boolean;
  defaultSelectedIds?: (string | number)[];
  defaultExpandedIds?: (string | number)[];
  searchTerm?: string;
  loading?: boolean;
  renderLabel?: (node: TreeNode) => ReactNode;
  showConnectors?: boolean;
}

export const Tree: FC<TreeProps> = ({
  nodes,
  onSelect,
  onExpand,
  className = '',
  showLines = true,
  showIcons = true,
  selectable = true,
  multiSelect = false,
  defaultExpandAll = false,
  defaultSelectedIds = [],
  defaultExpandedIds = [],
  searchTerm = '',
  loading = false,
  renderLabel,
  showConnectors = true,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(
    new Set(defaultExpandedIds)
  );
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(defaultSelectedIds)
  );

  // Handle defaultExpandAll
  useEffect(() => {
    if (defaultExpandAll) {
      const getAllIds = (nodes: TreeNode[]): (string | number)[] => {
        return nodes.reduce<(string | number)[]>((acc, node) => {
          acc.push(node.id);
          if (node.children?.length) {
            acc.push(...getAllIds(node.children));
          }
          return acc;
        }, []);
      };
      setExpandedIds(new Set(getAllIds(nodes)));
    }
  }, [defaultExpandAll, nodes]);

  const isExpanded = (nodeId: string | number) => expandedIds.has(nodeId);
  const isSelected = (nodeId: string | number) => selectedIds.has(nodeId);

  const toggleExpand = useCallback((node: TreeNode) => {
    if (node.disabled) return;

    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });

    onExpand?.(node, !isExpanded(node.id));
  }, [onExpand]);

  const handleSelect = useCallback((node: TreeNode, event: React.MouseEvent) => {
    if (!selectable || node.disabled) return;

    setSelectedIds(prev => {
      const next = new Set(prev);
      if (multiSelect && event.ctrlKey) {
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
      } else {
        next.clear();
        next.add(node.id);
      }
      return next;
    });

    onSelect?.(node);
  }, [selectable, multiSelect, onSelect]);

  const matchesSearch = (node: TreeNode): boolean => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      node.label.toLowerCase().includes(term) ||
      (node.children?.some(child => matchesSearch(child)) ?? false)
    );
  };

  const renderNode = (node: TreeNode, level: number = 0, isLastChild: boolean = true, parentIsLast: boolean[] = []) => {
    const hasChildren = node.children && node.children.length > 0;
    const expanded = isExpanded(node.id);
    const selected = isSelected(node.id);
    const matches = matchesSearch(node);

    if (!matches) return null;

    const DefaultIcon = () => (
      <svg
        className={`w-4 h-4 ${hasChildren ? 'text-gray-600' : 'text-gray-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {hasChildren ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={expanded ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'}
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        )}
      </svg>
    );

    const renderConnector = () => {
      if (!showConnectors || level === 0) return null;

      return (
        <div className="absolute left-0 -ml-px h-full">
          {parentIsLast.map((isLast, index) => (
            <div
              key={index}
              className={`
                absolute left-0 w-px h-full -ml-px
                ${isLast ? 'bg-transparent' : 'border-l border-gray-200'}
              `}
              style={{ left: `${(index + 1) * 24}px` }}
            />
          ))}
        </div>
      );
    };

    return (
      <div key={node.id} className={level > 0 ? 'ml-6' : ''}>
        <div className="relative">
          {renderConnector()}
          <div
            className={`
              flex items-center py-1 px-2 rounded-md relative
              ${selectable && !node.disabled ? 'cursor-pointer hover:bg-gray-100' : ''}
              ${selected ? 'bg-red-50 text-red-600' : ''}
              ${node.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={(e) => handleSelect(node, e)}
          >
            {/* Expand/Collapse Icon */}
            <div
              className={`
                mr-1 w-4 h-4 flex items-center justify-center
                ${hasChildren ? 'cursor-pointer' : 'invisible'}
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (hasChildren) toggleExpand(node);
              }}
            >
              {showIcons && <DefaultIcon />}
            </div>

            {/* Custom Icon */}
            {showIcons && node.icon && (
              <div className="mr-2">{node.icon}</div>
            )}

            {/* Label */}
            <div className="flex-1 truncate">
              {renderLabel ? renderLabel(node) : node.label}
            </div>
          </div>
        </div>

        {/* Children */}
        {hasChildren && expanded && (
          <div className={showLines ? 'ml-3 pl-4 border-l border-gray-200' : ''}>
            {node.children?.map((child, index, array) =>
              renderNode(
                child,
                level + 1,
                index === array.length - 1,
                [...parentIsLast, isLastChild]
              )
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <svg
          className="animate-spin h-5 w-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={className}>
      {nodes.map((node, index, array) =>
        renderNode(node, 0, index === array.length - 1, [])
      )}
    </div>
  );
};

// Helper components for common tree node types
interface FileTreeNode extends TreeNode {
  type: 'file' | 'folder';
}

export const FileTree: FC<Omit<TreeProps, 'nodes'> & { nodes: FileTreeNode[] }> = ({
  nodes,
  ...props
}) => {
  const getFileIcon = (type: 'file' | 'folder') => {
    if (type === 'folder') {
      return (
        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const nodesWithIcons = nodes.map(node => ({
    ...node,
    icon: getFileIcon(node.type),
  }));

  return <Tree nodes={nodesWithIcons} {...props} />;
};

export default Tree;
