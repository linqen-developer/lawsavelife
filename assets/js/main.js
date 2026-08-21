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
    const submitButton = form.querySelector("[type='submit']");
    const originalButtonText = submitButton?.textContent || "";
    const data = new FormData(form);

    if (!endpoint) {
      formStatus.textContent = "전송 경로를 확인할 수 없습니다. 02-430-0980으로 문의해 주세요.";
      formStatus.className = "form-status is-error";
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
      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false || result?.success === "false") {
        throw new Error("Consultation form submission failed");
      }

      form.reset();
      formStatus.textContent = "상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.";
      formStatus.className = "form-status is-success";
    } catch (error) {
      formStatus.textContent = "전송 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 02-430-0980으로 문의해 주세요.";
      formStatus.className = "form-status is-error";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
