import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { formOptions } from "@tanstack/react-form";
import { Button, FieldWrapper, Input } from "@ltk-forge/ui";
import { useProjectStore } from "../stores/project-store";
import { useAppForm } from "../lib/form";

const newProjectFormOpts = formOptions({
  defaultValues: {
    displayName: "",
    name: "",
    description: "",
    version: "1.0.0",
    author: "",
    projectPath: "",
  },
});

function NewProjectPage() {
  const navigate = useNavigate();
  const createProject = useProjectStore((s) => s.createProject);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useAppForm({
    ...newProjectFormOpts,
    validators: {
      onSubmit: ({ value }) => {
        const errors: Record<string, string> = {};
        if (!value.displayName.trim())
          errors.displayName = "Display name is required";
        if (!value.name.trim()) errors.name = "Machine name is required";
        if (!value.author.trim()) errors.author = "Author is required";
        if (!value.projectPath) errors.projectPath = "Location is required";
        return Object.keys(errors).length > 0 ? { fields: errors } : undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      const fullPath = `${value.projectPath}/${value.name}`;
      try {
        await createProject({
          name: value.name.trim(),
          display_name: value.displayName.trim(),
          description: value.description.trim(),
          version: value.version.trim() || "1.0.0",
          path: fullPath,
          author: value.author.trim(),
        });
        navigate({ to: "/project/browser" });
      } catch (err) {
        setSubmitError(String(err));
      }
    },
  });

  const handleBrowse = async () => {
    const selected = await open({ directory: true, multiple: false });
    if (selected) {
      form.setFieldValue("projectPath", selected);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            New Project
          </h1>
          <Button
            variant="ghost"
            intent="primary"
            className="text-xs"
            onClick={() => navigate({ to: "/" })}
          >
            Cancel
          </Button>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField
            name="displayName"
            listeners={{
              onChange: ({ value }) => {
                const currentName = form.getFieldValue("name");
                const currentDisplayName = form.getFieldValue("displayName");
                if (
                  !currentName ||
                  currentName === deriveMachineName(currentDisplayName)
                ) {
                  form.setFieldValue("name", deriveMachineName(value));
                }
              },
            }}
          >
            {(field) => (
              <field.TextField
                label="Display Name"
                required
                placeholder="My Awesome Mod"
              />
            )}
          </form.AppField>

          <form.AppField
            name="name"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return undefined;
                if (!/^[a-z0-9][a-z0-9-_]*$/.test(value)) {
                  return "Must start with a letter/number and contain only lowercase letters, numbers, hyphens, and underscores";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <field.TextField
                label="Machine Name"
                required
                placeholder="my-awesome-mod"
                description="Alphanumeric, hyphens, and underscores only"
              />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.TextareaField
                label="Description"
                placeholder="A brief description of your mod"
                rows={2}
              />
            )}
          </form.AppField>

          <div className="flex gap-3">
            <div className="flex-1">
              <form.AppField
                name="version"
                validators={{
                  onBlur: ({ value }) => {
                    if (!value) return undefined;
                    if (!/^\d+\.\d+\.\d+/.test(value)) {
                      return "Version must follow semver format (e.g. 1.0.0)";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <field.TextField label="Version" placeholder="1.0.0" />
                )}
              </form.AppField>
            </div>
            <div className="flex-1">
              <form.AppField name="author">
                {(field) => (
                  <field.TextField
                    label="Author"
                    required
                    placeholder="Your name"
                  />
                )}
              </form.AppField>
            </div>
          </div>

          {/* Location field — custom layout since it has a browse button */}
          <form.Subscribe
            selector={(state) => ({
              projectPath: state.values.projectPath,
              name: state.values.name,
            })}
          >
            {({ projectPath, name }) => (
              <FieldWrapper label="Location" required>
                <div className="flex gap-2">
                  <Input
                    value={projectPath}
                    placeholder="Select a folder..."
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    intent="primary"
                    className="text-xs px-3 shrink-0"
                    onClick={handleBrowse}
                  >
                    Browse
                  </Button>
                </div>
                {projectPath && name && (
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                    Project will be created at: {projectPath}/{name}
                  </p>
                )}
              </FieldWrapper>
            )}
          </form.Subscribe>

          {submitError && (
            <div className="rounded-md bg-[var(--color-danger-500)]/10 border border-[var(--color-danger-500)]/20 px-3 py-2 text-xs text-[var(--color-danger-400)]">
              {submitError}
            </div>
          )}

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                intent="primary"
                fullWidth
                className="mt-2"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  );
}

function deriveMachineName(displayName: string): string {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const Route = createFileRoute("/new-project")({
  component: NewProjectPage,
});
