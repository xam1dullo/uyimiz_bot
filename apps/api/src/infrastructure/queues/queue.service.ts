import { Injectable, Logger } from '@nestjs/common';
import { Queue, Worker, type Job } from 'bullmq';

interface QueueJob {
  type: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private queues = new Map<string, Queue>();
  private workers = new Map<string, Worker>();

  private get connection() {
    return { connection: { url: process.env.REDIS_URL ?? 'redis://localhost:6379' } };
  }

  /** Add job to queue — returns job ID for cancellation */
  async add(queueName: string, job: QueueJob, delay?: number): Promise<string> {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, new Queue(queueName, this.connection));
    }
    const queue = this.queues.get(queueName)!;
    const added = await queue.add(job.type, job.payload, { 
      delay,
      removeOnComplete: true,
      removeOnFail: 100,
    });
    this.logger.debug(`Job added: ${queueName}:${job.type} (${added.id})`);
    return added.id ?? '';
  }

  /** Cancel a job by ID */
  async cancel(queueName: string, jobId: string): Promise<boolean> {
    const queue = this.queues.get(queueName);
    if (!queue) return false;
    try {
      const job = await queue.getJob(jobId);
      if (job) {
        await job.remove();
        this.logger.debug(`Job cancelled: ${queueName}:${jobId}`);
        return true;
      }
      return false;
    } catch (e) {
      this.logger.error(`Cancel failed: ${queueName}:${jobId}: ${e}`);
      return false;
    }
  }

  /** Register worker for queue */
  registerWorker(
    queueName: string,
    handler: (job: Job) => Promise<void>,
    concurrency = 5,
  ): void {
    if (this.workers.has(queueName)) return;
    
    const worker = new Worker(queueName, async (job) => {
      this.logger.debug(`Processing: ${job.name} (${job.id})`);
      await handler(job);
    }, { ...this.connection, concurrency });

    worker.on('completed', (job) => {
      this.logger.debug(`Completed: ${job!.name} (${job!.id})`);
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`Failed: ${job!.name} (${job!.id}): ${err.message}`);
    });

    this.workers.set(queueName, worker);
    this.logger.log(`Worker registered: ${queueName} (concurrency: ${concurrency})`);
  }
}
