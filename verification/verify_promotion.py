import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Simulate Login
        page.add_init_script("""
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userData', JSON.stringify({ name: 'Admin User', role: 'admin' }));
        """)

        try:
            print("Navigating to Promotion Workflow...")
            page.goto("http://localhost:3000/admin/class-management/promotion")

            # Wait for content to load
            page.wait_for_selector("text=Konfigurasi Periode Kenaikan", timeout=30000)
            time.sleep(2)
            page.screenshot(path="verification/step1_setup.png")
            print("Step 1 Screenshot taken.")

            # Step 1: Select Years
            print("Selecting Years...")

            # Select Source Year
            # Click the trigger
            page.click("button:has-text('Pilih Tahun Asal')")
            # Click the option
            page.click("div[role='option']:has-text('2024/2025')")
            time.sleep(0.5)

            # Select Target Year
            page.click("button:has-text('Pilih Tahun Tujuan')")
            page.click("div[role='option']:has-text('2025/2026')")
            time.sleep(0.5)

            # Click Next
            print("Clicking Next to Step 2...")
            page.click("button:has-text('Lanjut')")

            # Step 2: Mapping
            print("Step 2: Mapping...")
            page.wait_for_selector("text=Pemetaan Kelas", timeout=10000)
            time.sleep(2)
            page.screenshot(path="verification/step2_mapping.png")
            print("Step 2 Screenshot taken.")

            # Click Auto Map
            print("Clicking Auto Map...")
            page.click("button:has-text('Auto Map')")
            time.sleep(2) # Wait for toast/update

            # Click Next
            print("Clicking Next to Step 3...")
            page.click("button:has-text('Lanjut')")

            # Step 3: Review
            print("Step 3: Review...")
            page.wait_for_selector("text=Verifikasi Siswa", timeout=10000)
            time.sleep(2)
            page.screenshot(path="verification/step3_review.png")
            print("Step 3 Screenshot taken.")

            # Click Next
            print("Clicking Next to Step 4...")
            page.click("button:has-text('Lanjut')")

            # Step 4: Summary
            print("Step 4: Summary...")
            page.wait_for_selector("text=Ringkasan Kenaikan Kelas", timeout=10000)
            time.sleep(1)
            page.screenshot(path="verification/step4_summary.png")
            print("Step 4 Screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
