<script>
const members = [
  { name: "Robert Sun", title: "ABC, cosmth2", img: "robert.jpeg" },
  { name: "Felipe Cardozo", title: "xyz, cto", img: "Felipe Cardozo.jpeg" },
  { name: "Christopher Treston", title: "xz, cosmth3", img: "chris.jpeg" },
  { name: "Emma Adams", title: "AMI, COsmth1", img: "emma.jpeg" }
];

const container = document.getElementById("card-container");

members.forEach(({ name, title, img }) => {
  container.innerHTML += `
    <div class="reveal-up tw-flex tw-border-[#333a44] tw-bg-[#1d2127] tw-border-[1px] tw-h-fit tw-w-[350px] tw-break-inside-avoid tw-flex-col tw-rounded-lg tw-p-4 max-lg:tw-w-[320px]">
      <div class="tw-flex tw-place-items-center tw-gap-3">
        <div class="tw-h-[50px] tw-w-[50px] tw-overflow-hidden tw-rounded-full tw-border-[2px] tw-border-solid tw-border-primary">
          <img src="members/exe/${img}" class="tw-h-full tw-w-full tw-object-cover" alt="${name}" />
        </div>
        <div class="tw-flex tw-flex-col tw-gap-1">
          <div class="tw-font-semibold">${name}</div>
          <div class="tw-text-gray-400">${title}</div>
        </div>
      </div>
      <p class="tw-mt-4 tw-text-gray-300">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
    </div>
  `;
});
</script>
