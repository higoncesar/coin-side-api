import { describe, it, expect, beforeEach } from 'vitest';
import { DomainEvent } from '../../DomainEvent';
import { AggregateRoot } from '@/domain/_shared/AggregateRoot';

class TestEvent extends DomainEvent {
  constructor(public readonly payload: string) {
    super();
  }
}

interface TestProps {
  value: string;
}
class TestAggregate extends AggregateRoot<TestProps> {
  static create(value: string) {
    const aggregate = new TestAggregate({ value });
    aggregate.addDomainEvent(new TestEvent(value));
    return aggregate;
  }
  get value() {
    return this.props.value;
  }

  toPrimitive() {
    return this.props;
  }
}

describe('AggregateRoot', () => {
  let aggregate: TestAggregate;

  beforeEach(() => {
    aggregate = TestAggregate.create('test-value');
  });

  it('should add a domain event', () => {
    expect(aggregate.domainEvents.length).toBe(1);
    expect(aggregate.domainEvents[0]).toBeInstanceOf(TestEvent);
    expect((aggregate.domainEvents[0] as TestEvent).payload).toBe('test-value');
  });

  it('should list all domain events', () => {
    aggregate.addDomainEvent(new TestEvent('another'));
    expect(aggregate.domainEvents.length).toBe(2);
    expect((aggregate.domainEvents[1] as TestEvent).payload).toBe('another');
  });

  it('should clear domain events', () => {
    aggregate.clearDomainEvents();
    expect(aggregate.domainEvents.length).toBe(0);
  });

  it('should set occurredAt on domain event', () => {
    const event = aggregate.domainEvents[0];
    expect(event.occurredAt).toBeInstanceOf(Date);
    expect(event.occurredAt.getTime()).toBeLessThanOrEqual(Date.now());
  });
});
