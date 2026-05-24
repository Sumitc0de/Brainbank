import { AnimatePresence, motion } from 'framer-motion';
import useIdeaStore from '../../store/useIdeaStore';
import Header from '../Header';
import DashboardView from '../../views/DashboardView';
import IdeasView from '../../views/IdeasView';
import QueueView from '../../views/QueueView';
import ResearchView from '../../views/ResearchView';
import TasksView from '../../views/TasksView';
import CompletedView from '../../views/CompletedView';
import SettingsView from '../../views/SettingsView';

const views = {
  dashboard: DashboardView,
  ideas: IdeasView,
  queue: QueueView,
  research: ResearchView,
  tasks: TasksView,
  completed: CompletedView,
  settings: SettingsView,
};

export default function MainWorkspace({ onMenuToggle }) {
  const activeView = useIdeaStore((s) => s.activeView);
  const View = views[activeView] || DashboardView;

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header onMenuToggle={onMenuToggle} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <View />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
