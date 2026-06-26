const form = document.querySelector("[data-consult-form]");
const formStatus = document.querySelector("[data-form-status]");
const year = document.querySelector("[data-year]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const serviceSelect = document.querySelector("#service");
const serviceShortcuts = document.querySelectorAll("[data-service-shortcut]");
const faqItems = document.querySelectorAll(".faq-item");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
}

serviceShortcuts.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-service-shortcut");
    if (serviceSelect && value) {
      serviceSelect.value = value;
    }

    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

faqItems.forEach((item) => {
  const button = item.querySelector("button");

  button?.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("is-open");
      otherItem.querySelector("button")?.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

if (form && formStatus) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const endpoint = form.getAttribute("action")?.trim();
    const fallbackEmail = form.getAttribute("data-mail-fallback") || "fwp-law@outlook.kr";
    const submitButton = form.querySelector("[type='submit']");
    const originalButtonText = submitButton?.textContent || "";
    const data = new FormData(form);

    const isExternalEndpoint = endpoint && !endpoint.startsWith("mailto:");

    if (!isExternalEndpoint) {
      const name = data.get("name") || "";
      const phone = data.get("phone") || "";
    const service = data.get("service") || "";
    const region = data.get("region") || "";
    const debt = data.get("debt") || "";
    const assets = data.get("assets") || "";
    const age = data.get("age") || "";
    const creditors = data.get("creditors") || "";
    const cause = data.get("cause") || "";
    const message = data.get("message") || "";
    const body = [
      "법무사김현수사무소 홈페이지 상담 신청",
      "",
      `성함: ${name}`,
      `연락처: ${phone}`,
      `상담 분야: ${service}`,
      `거주지역: ${region}`,
      `총채무액: ${debt}`,
      `총재산: ${assets}`,
      `연령: ${age}`,
      `채권수: ${creditors}`,
      `채무원인: ${cause}`,
      "",
      "현재 상황:",
      message,
      ].join("\n");

      window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent("법무사김현수사무소 홈페이지 상담 신청")}&body=${encodeURIComponent(body)}`;
      formStatus.textContent = "메일 작성 창을 열었습니다. 자동 접수 폼을 연결하면 이 영역에서 바로 접수 완료 상태로 전환됩니다.";
      formStatus.className = "form-status is-info";
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "전송 중입니다";
    }

    formStatus.textContent = "상담 신청을 전송하고 있습니다.";
    formStatus.className = "form-status";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Consultation form submission failed");
      }

      form.reset();
      formStatus.textContent = "상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.";
      formStatus.className = "form-status is-success";
    } catch (error) {
      formStatus.textContent = "전송 중 오류가 발생했습니다. 전화 또는 이메일로 문의해 주세요.";
      formStatus.className = "form-status is-error";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
