
export const ACTIVITY_SELECTION_CODE = `public void solve(int[] start, int[] end) {
    // 1. Sort by end time
    Arrays.sort(activities, (a, b) -> a.end - b.end);

    int i = 0;
    print(activities[i]); // Select first

    // 2. Greedy Selection
    for (int j = 1; j < n; j++) {
        if (activities[j].start >= activities[i].end) {
            print(activities[j]); // Sort compatible
            i = j;
        }
    }
}`;

export interface Activity {
    id: string;
    start: number;
    end: number;
    isSelected: boolean;
    isConsidered: boolean;
}

export interface GreedyStep {
    activities: Activity[];
    currentIdx: number;
    lastSelectedIdx: number | null;
    description: string;
    codeLine?: number;
}

export function* activitySelection(initialActivities: Activity[]): Generator<GreedyStep> {
    // 1. Pre-sort
    const activities = initialActivities.map(a => ({ ...a })); // Copy

    // Sort logic handled in visualizer for animation, or we can assume pre-sorted input for this algo run.
    // Let's assume the visualizer passes sorted activities or we sort them first step.
    activities.sort((a, b) => a.end - b.end);

    yield {
        activities: activities.map(a => ({ ...a })),
        currentIdx: -1,
        lastSelectedIdx: null,
        description: "Activities sorted by end time.",
        codeLine: 3
    };

    if (activities.length === 0) return;

    // Select first
    activities[0].isSelected = true;
    let lastSelected = 0;

    yield {
        activities: activities.map(a => ({ ...a })),
        currentIdx: 0,
        lastSelectedIdx: 0,
        description: "Always select the first activity (earliest finish time).",
        codeLine: 6
    };

    for (let j = 1; j < activities.length; j++) {
        activities[j].isConsidered = true;
        const current = activities[j];
        const last = activities[lastSelected];

        yield {
            activities: activities.map(a => ({ ...a })),
            currentIdx: j,
            lastSelectedIdx: lastSelected,
            description: `Checking activity [${current.start}, ${current.end}]. Start >= Last End (${last.end})?`,
            codeLine: 10
        };

        if (current.start >= last.end) {
            activities[j].isSelected = true;
            activities[j].isConsidered = false; // Reset considered state

            yield {
                activities: activities.map(a => ({ ...a })),
                currentIdx: j,
                lastSelectedIdx: lastSelected,
                description: `Compatible! ${current.start} >= ${last.end}. Selecting.`,
                codeLine: 11
            };

            lastSelected = j;
        } else {
            activities[j].isConsidered = false;
            yield {
                activities: activities.map(a => ({ ...a })),
                currentIdx: j,
                lastSelectedIdx: lastSelected,
                description: `Conflict! ${current.start} < ${last.end}. Skipping.`,
                codeLine: 10
            };
        }
    }

    yield {
        activities: activities.map(a => ({ ...a })),
        currentIdx: -1,
        lastSelectedIdx: -1,
        description: "Greedy selection complete.",
        codeLine: undefined
    };
}
