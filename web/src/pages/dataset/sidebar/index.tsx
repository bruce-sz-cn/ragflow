import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { Button } from '@/components/ui/button';
import { useSecondPathName } from '@/hooks/route-hook';
import {
  useFetchKnowledgeBaseConfiguration,
  useFetchKnowledgeGraph,
} from '@/hooks/use-knowledge-request';
import { cn, formatBytes } from '@/lib/utils';
import { Routes } from '@/routes';
import { formatPureDate } from '@/utils/date';
import { isEmpty } from 'lodash';
import { Banknote, Database, FileSearch2, GitGraph } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHandleMenuClick } from './hooks';

type PropType = {
  refreshCount?: number;
};

export function SideBar({ refreshCount }: PropType) {
  const pathName = useSecondPathName();
  const { handleMenuClick } = useHandleMenuClick();
  // refreshCount: be for avatar img sync update on top left
  const { data } = useFetchKnowledgeBaseConfiguration(refreshCount);
  const { data: routerData } = useFetchKnowledgeGraph();
  const { t } = useTranslation();

  const items = useMemo(() => {
    const list = [
      {
        icon: Database,
        label: t(`knowledgeDetails.dataset`),
        key: Routes.DatasetBase,
      },
      {
        icon: FileSearch2,
        label: t(`knowledgeDetails.testing`),
        key: Routes.DatasetTesting,
      },
      {
        icon: Banknote,
        label: t(`knowledgeDetails.configuration`),
        key: Routes.DatasetSetting,
      },
    ];
    if (!isEmpty(routerData?.graph)) {
      list.push({
        icon: GitGraph,
        label: t(`knowledgeDetails.knowledgeGraph`),
        key: Routes.KnowledgeGraph,
      });
    }
    return list;
  }, [t, routerData]);

  return (
    <aside className="relative p-5 space-y-8">
      <div className="flex gap-2.5 max-w-[200px] items-center">
        <RAGFlowAvatar
          avatar={data.avatar}
          name={data.name}
          className="size-16"
        ></RAGFlowAvatar>
        <div className=" text-text-sub-title text-xs space-y-1">
          <h3 className="text-lg font-semibold line-clamp-1 text-text-title">
            {data.name}
          </h3>
          <div className="flex justify-between">
            <span>{data.doc_num} files</span>
            <span>{formatBytes(data.size)}</span>
          </div>
          <div>Created {formatPureDate(data.create_time)}</div>
        </div>
      </div>

      <div className="w-[200px] flex flex-col gap-5">
        {items.map((item, itemIdx) => {
          const active = '/' + pathName === item.key;
          return (
            <Button
              key={itemIdx}
              variant={active ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-2.5 px-3 relative h-10 text-text-sub-title-invert',
                {
                  'bg-background-card': active,
                  'text-text-title': active,
                },
              )}
              onClick={handleMenuClick(item.key)}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </div>
    </aside>
  );
}
