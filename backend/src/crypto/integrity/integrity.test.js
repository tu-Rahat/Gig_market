"use strict";

const {
    createIntegrityTag,
    verifyIntegrityTag
} = require("./integrity.service");

const TEST_SECRET = "test-hmac-secret-123";

const runTests = () => {
    console.log("\n=== INTEGRITY PROTECTION TESTS ===\n");

    let passCount = 0;
    let failCount = 0;

    // Test 1: Create and verify valid integrity tag
    try {
        const payload = {
            userId: "123",
            amount: 500,
            status: "pending"
        };

        const tag = createIntegrityTag(payload, TEST_SECRET);
        const isValid = verifyIntegrityTag(payload, tag, TEST_SECRET);

        if (isValid) {
            console.log("✓ Test 1 PASS: Valid integrity tag verified");
            passCount++;
        } else {
            console.log("✗ Test 1 FAIL: Valid tag should verify");
            failCount++;
        }
    } catch (error) {
        console.log("✗ Test 1 FAIL:", error.message);
        failCount++;
    }

    // Test 2: Reject tampered payload
    try {
        const payload = {
            userId: "123",
            amount: 500,
            status: "pending"
        };

        const tag = createIntegrityTag(payload, TEST_SECRET);

        const tampered = {
            ...payload,
            amount: 5000
        };

        const isValid = verifyIntegrityTag(tampered, tag, TEST_SECRET);

        if (!isValid) {
            console.log("✓ Test 2 PASS: Tampered payload rejected");
            passCount++;
        } else {
            console.log("✗ Test 2 FAIL: Tampered payload should be rejected");
            failCount++;
        }
    } catch (error) {
        console.log("✗ Test 2 FAIL:", error.message);
        failCount++;
    }

    // Test 3: Reject wrong secret
    try {
        const payload = {
            userId: "123",
            amount: 500
        };

        const tag = createIntegrityTag(payload, TEST_SECRET);
        const wrongSecret = "wrong-secret";

        const isValid = verifyIntegrityTag(payload, tag, wrongSecret);

        if (!isValid) {
            console.log("✓ Test 3 PASS: Wrong secret rejected");
            passCount++;
        } else {
            console.log("✗ Test 3 FAIL: Wrong secret should be rejected");
            failCount++;
        }
    } catch (error) {
        console.log("✗ Test 3 FAIL:", error.message);
        failCount++;
    }

    // Test 4: Consistent tagging (same payload always produces same tag)
    try {
        const payload = {
            userId: "456",
            amount: 1000,
            status: "completed"
        };

        const tag1 = createIntegrityTag(payload, TEST_SECRET);
        const tag2 = createIntegrityTag(payload, TEST_SECRET);

        if (tag1 === tag2) {
            console.log("✓ Test 4 PASS: Consistent tagging");
            passCount++;
        } else {
            console.log("✗ Test 4 FAIL: Same payload should produce same tag");
            failCount++;
        }
    } catch (error) {
        console.log("✗ Test 4 FAIL:", error.message);
        failCount++;
    }

    // Test 5: Property order independence
    try {
        const payload1 = {
            userId: "789",
            amount: 2000,
            status: "active"
        };

        const payload2 = {
            status: "active",
            amount: 2000,
            userId: "789"
        };

        const tag1 = createIntegrityTag(payload1, TEST_SECRET);
        const tag2 = createIntegrityTag(payload2, TEST_SECRET);

        if (tag1 === tag2) {
            console.log("✓ Test 5 PASS: Property order independent");
            passCount++;
        } else {
            console.log("✗ Test 5 FAIL: Property order should not matter");
            failCount++;
        }
    } catch (error) {
        console.log("✗ Test 5 FAIL:", error.message);
        failCount++;
    }

    // Test 6: Array payload integrity
    try {
        const payload = {
            items: ["item1", "item2", "item3"]
        };

        const tag = createIntegrityTag(payload, TEST_SECRET);
        const isValid = verifyIntegrityTag(payload, tag, TEST_SECRET);

        if (isValid) {
            console.log("✓ Test 6 PASS: Array payload integrity verified");
            passCount++;
        } else {
            console.log("✗ Test 6 FAIL: Array payload should verify");
            failCount++;
        }
    } catch (error) {
        console.log("✗ Test 6 FAIL:", error.message);
        failCount++;
    }

    // Test 7: Nested object integrity
    try {
        const payload = {
            user: {
                id: "123",
                profile: {
                    name: "John Doe",
                    email: "john@example.com"
                }
            },
            timestamp: 1234567890
        };

        const tag = createIntegrityTag(payload, TEST_SECRET);
        const isValid = verifyIntegrityTag(payload, tag, TEST_SECRET);

        if (isValid) {
            console.log("✓ Test 7 PASS: Nested object integrity verified");
            passCount++;
        } else {
            console.log("✗ Test 7 FAIL: Nested object should verify");
            failCount++;
        }
    } catch (error) {
        console.log("✗ Test 7 FAIL:", error.message);
        failCount++;
    }

    // Test 8: Null/undefined handling
    try {
        const payload = {
            userId: "999",
            middleName: null,
            phone: undefined
        };

        const tag = createIntegrityTag(payload, TEST_SECRET);
        const isValid = verifyIntegrityTag(payload, tag, TEST_SECRET);

        if (isValid) {
            console.log("✓ Test 8 PASS: Null/undefined handling verified");
            passCount++;
        } else {
            console.log("✗ Test 8 FAIL: Null/undefined should be handled");
            failCount++;
        }
    } catch (error) {
        console.log("✗ Test 8 FAIL:", error.message);
        failCount++;
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`PASSED: ${passCount}`);
    console.log(`FAILED: ${failCount}`);
    console.log(`TOTAL:  ${passCount + failCount}`);

    if (failCount === 0) {
        console.log("\n=== ALL INTEGRITY TESTS PASSED ===\n");
        process.exit(0);
    } else {
        console.log("\n=== SOME TESTS FAILED ===\n");
        process.exit(1);
    }
};

// Run tests if executed directly
if (require.main === module) {
    runTests();
}

module.exports = {
    runTests
};
