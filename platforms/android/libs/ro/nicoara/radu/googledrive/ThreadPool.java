package ro.nicoara.radu.googledrive;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class ThreadPool {
	public static class PriorityThreadFactory implements ThreadFactory {
		private final int mThreadPriority;

		public PriorityThreadFactory(int threadPriority) {
			mThreadPriority = threadPriority;
		}

		@Override
		public Thread newThread(final Runnable runnable) {
			Runnable wrapperRunnable = new Runnable() {
				@Override
				public void run() {
					try {
						android.os.Process.setThreadPriority(mThreadPriority);
					} catch (Throwable t) {

					}
					runnable.run();
				}
			};
			return new Thread(wrapperRunnable);
		}
	}
	
	private static ThreadPoolExecutor threadPool = null;
	
	public static ThreadPoolExecutor getPool(){
			if (threadPool != null) {
				return threadPool;
			}
			int NUMBER_OF_CORES = Runtime.getRuntime().availableProcessors();
			ThreadFactory backgroundPriorityThreadFactory = new PriorityThreadFactory(android.os.Process.THREAD_PRIORITY_BACKGROUND);

			ThreadPoolExecutor executor = new ThreadPoolExecutor(
					NUMBER_OF_CORES * 2,
					NUMBER_OF_CORES * 2,
					60L,
					TimeUnit.SECONDS,
					new LinkedBlockingQueue<Runnable>(),
					backgroundPriorityThreadFactory
			);
		threadPool = executor;
		return executor;
	}
}
