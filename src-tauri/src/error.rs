use serde::Serialize;
use std::fmt;

#[derive(Debug, Serialize)]
#[serde(tag = "kind", content = "message")]
pub enum ProjectError {
    DirectoryNotEmpty(String),
    InvalidName(String),
    InvalidPath(String),
    NotADirectory(String),
    MissingConfig(String),
    InvalidConfig(String),
    ProjectNotFound(String),
    AssetError(String),
    NoScratchDir(String),
    IoError(String),
}

impl fmt::Display for ProjectError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::DirectoryNotEmpty(msg) => write!(f, "Directory not empty: {msg}"),
            Self::InvalidName(msg) => write!(f, "Invalid name: {msg}"),
            Self::InvalidPath(msg) => write!(f, "Invalid path: {msg}"),
            Self::NotADirectory(msg) => write!(f, "Not a directory: {msg}"),
            Self::MissingConfig(msg) => write!(f, "Missing config: {msg}"),
            Self::InvalidConfig(msg) => write!(f, "Invalid config: {msg}"),
            Self::ProjectNotFound(msg) => write!(f, "Project not found: {msg}"),
            Self::AssetError(msg) => write!(f, "Asset error: {msg}"),
            Self::NoScratchDir(msg) => write!(f, "No scratch directory: {msg}"),
            Self::IoError(msg) => write!(f, "I/O error: {msg}"),
        }
    }
}

impl std::error::Error for ProjectError {}

impl From<std::io::Error> for ProjectError {
    fn from(err: std::io::Error) -> Self {
        Self::IoError(err.to_string())
    }
}

impl From<serde_json::Error> for ProjectError {
    fn from(err: serde_json::Error) -> Self {
        Self::InvalidConfig(err.to_string())
    }
}
