import {
  processResizeMutation,
  processResizeMutationNoChangesErrText,
  processResizeMutationElNotFoundErrText,
  processResizeMutationElInvalidErrText,
  processResizeMutationNoMutationsErrText,
} from 'hooks/helpers/useHandleResize/startResizeListener/processResizeMutation';
import { mockConsole } from 'tests/mocks/console';
import { TEST_PROPS } from 'tests/mocks/variables';
import { multilineToSingleLineLowerCased } from 'tests/utils/multilineToSingleLine';

type TMutationTargetTest = { target: HTMLElement };
type TMutationTest = Pick<MutationRecord, 'oldValue'> & TMutationTargetTest;
type TMutationRecordTest = Omit<MutationRecord, 'target'> & TMutationTargetTest;

const TEST_PROCESS_RESIZE_MUTATION: TMutationTest = {
  oldValue: `width: ${TEST_PROPS.parentRef.current?.clientWidth}px; height: ${TEST_PROPS.parentRef.current?.clientHeight}px`,
  target: TEST_PROPS.parentRef.current as HTMLElement,
} as TMutationRecordTest;


describe('function "processResizeMutation"', () => {
  it('shows an error: "No mutations received"', () => {
    expect.hasAssertions();
    const assertions = 3;
    expect.assertions(assertions);
    const { consoleErrorMocked } = mockConsole();

    // @ts-ignore
    processResizeMutation(undefined);
    // @ts-ignore
    processResizeMutation(1234);
    processResizeMutation([]);

    Array(assertions)
      .fill(null)
      .forEach((_, i) => expect(multilineToSingleLineLowerCased(consoleErrorMocked.mock.calls[i][0]))
        .toContain(multilineToSingleLineLowerCased(processResizeMutationNoMutationsErrText)));

  });

  it('shows an error: "Node element not found in received mutation"', () => {
    expect.assertions(1);
    const { consoleErrorMocked } = mockConsole();

    processResizeMutation([ {
      ...TEST_PROCESS_RESIZE_MUTATION,
      // @ts-ignore
      target: undefined,
    } ]);

    const consoleCallText = consoleErrorMocked.mock.calls[0][0];

    expect(multilineToSingleLineLowerCased(consoleCallText))
      .toContain(multilineToSingleLineLowerCased(processResizeMutationElNotFoundErrText));
  });

  it('shows an error: "node element has invalid "clientWidth" or "clientHeight" param (or both)"', () => {
    expect.assertions(2);
    const { consoleErrorMocked } = mockConsole();

    const mutation: TMutationTest = {
      ...TEST_PROCESS_RESIZE_MUTATION,
      target: {
        ...TEST_PROCESS_RESIZE_MUTATION.target,
        // @ts-ignore
        clientWidth: '1234',
      },
    };

    const anotherMutation: TMutationTest = {
      ...TEST_PROCESS_RESIZE_MUTATION,
      target: {
        ...TEST_PROCESS_RESIZE_MUTATION.target,
        // @ts-ignore
        clientHeight: '1234',
      },
    };

    processResizeMutation([ mutation ] as TMutationRecordTest[]);
    processResizeMutation([ anotherMutation ] as TMutationRecordTest[]);

    const consoleCallText = consoleErrorMocked.mock.calls[0][0];
    const anotherConsoleCallText = consoleErrorMocked.mock.calls[1][0];

    expect(multilineToSingleLineLowerCased(consoleCallText))
      .toContain(multilineToSingleLineLowerCased(processResizeMutationElInvalidErrText));

    expect(multilineToSingleLineLowerCased(anotherConsoleCallText))
      .toContain(multilineToSingleLineLowerCased(processResizeMutationElInvalidErrText));
  });

  it('shows an error: "received mutation has no changes"', () => {
    expect.assertions(1);
    const { consoleErrorMocked } = mockConsole();

    processResizeMutation([ TEST_PROCESS_RESIZE_MUTATION ] as TMutationRecordTest[]);

    const consoleCallText = consoleErrorMocked.mock.calls[0][0];

    expect(multilineToSingleLineLowerCased(consoleCallText))
      .toContain(multilineToSingleLineLowerCased(processResizeMutationNoChangesErrText));
  });

  it('shows no errors', () => {
    expect.assertions(1);
    const { consoleErrorMocked } = mockConsole();

    const mutation1: TMutationTest = {
      ...TEST_PROCESS_RESIZE_MUTATION,
      oldValue: `width: ${TEST_PROCESS_RESIZE_MUTATION.target.clientWidth}px`,
      target: {
        ...TEST_PROCESS_RESIZE_MUTATION.target,
        clientWidth: TEST_PROCESS_RESIZE_MUTATION.target.clientWidth + 1,
      },
    };

    const mutation2: TMutationTest = {
      ...TEST_PROCESS_RESIZE_MUTATION,
      oldValue: `height: ${TEST_PROCESS_RESIZE_MUTATION.target.clientHeight}px`,
      target: {
        ...TEST_PROCESS_RESIZE_MUTATION.target,
        clientHeight: TEST_PROCESS_RESIZE_MUTATION.target.clientHeight + 1,
      },
    };

    const mutation3: TMutationTest = {
      ...TEST_PROCESS_RESIZE_MUTATION,
      oldValue: '',
    };

    processResizeMutation([ mutation1 ] as TMutationRecordTest[]);
    processResizeMutation([ mutation2 ] as TMutationRecordTest[]);
    processResizeMutation([ mutation3 ] as TMutationRecordTest[]);

    expect(consoleErrorMocked).toHaveBeenCalledTimes(0);
  });
});
